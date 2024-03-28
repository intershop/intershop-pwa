import { ModuleWithProviders, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { FeatureToggleDirective } from './directives/feature-toggle.directive';
import { NotFeatureToggleDirective } from './directives/not-feature-toggle.directive';
import { FeatureToggleService, FeatureToggleType, checkFeature } from './utils/feature-toggle/feature-toggle.service';

@NgModule({
  declarations: [FeatureToggleDirective, NotFeatureToggleDirective],
  exports: [FeatureToggleDirective, NotFeatureToggleDirective],
})
export class FeatureToggleModule {
  private static features$ = new BehaviorSubject<FeatureToggleType[]>(undefined);

  static forTesting(...features: FeatureToggleType[]): ModuleWithProviders<FeatureToggleModule> {
    FeatureToggleModule.switchTestingFeatures(...features);
    return {
      ngModule: FeatureToggleModule,
      providers: [
        {
          provide: FeatureToggleService,
          useValue: {
            enabled$: (feature: FeatureToggleType) =>
              FeatureToggleModule.features$.pipe(map(toggles => checkFeature(toggles, feature))),
            // eslint-disable-next-line rxjs/no-subject-value
            enabled: (feature: FeatureToggleType) => checkFeature(FeatureToggleModule.features$.value, feature),
          },
        },
      ],
    };
  }

  static switchTestingFeatures(...features: FeatureToggleType[]) {
    FeatureToggleModule.features$.next(features);
  }
}

export { FeatureToggleService } from './utils/feature-toggle/feature-toggle.service';
export { featureToggleGuard } from './guards/feature-toggle.guard';
