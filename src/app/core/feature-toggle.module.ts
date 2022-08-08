import { ModuleWithProviders, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { FeatureToggleDirective } from './directives/feature-toggle.directive';
import { NotFeatureToggleDirective } from './directives/not-feature-toggle.directive';
import { FeatureToggleService, checkFeature } from './utils/feature-toggle/feature-toggle.service';

@NgModule({
  declarations: [FeatureToggleDirective, NotFeatureToggleDirective],
  exports: [FeatureToggleDirective, NotFeatureToggleDirective],
})
export class FeatureToggleModule {
  private static features$ = new BehaviorSubject<string[]>(undefined);

  static forTesting(...features: string[]): ModuleWithProviders<FeatureToggleModule> {
    FeatureToggleModule.switchTestingFeatures(...features);
    return {
      ngModule: FeatureToggleModule,
      providers: [
        {
          provide: FeatureToggleService,
          useValue: {
            enabled$: (feature: string) =>
              FeatureToggleModule.features$.pipe(map(toggles => checkFeature(toggles, feature))),
            // eslint-disable-next-line rxjs/no-subject-value
            enabled: (feature: string) => checkFeature(FeatureToggleModule.features$.value, feature),
          },
        },
      ],
    };
  }

  static switchTestingFeatures(...features: string[]) {
    FeatureToggleModule.features$.next(features);
  }
}

export { FeatureToggleService } from './utils/feature-toggle/feature-toggle.service';
export { FeatureToggleGuard } from './guards/feature-toggle.guard';
