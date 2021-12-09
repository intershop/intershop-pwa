import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { FeatureToggleDirective } from './directives/feature-toggle.directive';
import { NotFeatureToggleDirective } from './directives/not-feature-toggle.directive';
import { FeatureToggleService, checkFeature } from './utils/feature-toggle/feature-toggle.service';

@NgModule({
  declarations: [FeatureToggleDirective, NotFeatureToggleDirective],
  exports: [FeatureToggleDirective, NotFeatureToggleDirective],
})
export class FeatureToggleModule {
  private static features = new ReplaySubject<string[]>(1);

  static forTesting(...features: string[]): ModuleWithProviders<FeatureToggleModule> {
    FeatureToggleModule.switchTestingFeatures(...features);
    return {
      ngModule: FeatureToggleModule,
      providers: [
        {
          provide: FeatureToggleService,
          useValue: {
            enabled: (feature: string) =>
              FeatureToggleModule.features.pipe(map(toggles => checkFeature(toggles, feature))),
          },
        },
      ],
    };
  }

  static switchTestingFeatures(...features: string[]) {
    FeatureToggleModule.features.next(features);
  }
}

export { FeatureToggleService } from './utils/feature-toggle/feature-toggle.service';
export { FeatureToggleGuard } from './guards/feature-toggle.guard';
