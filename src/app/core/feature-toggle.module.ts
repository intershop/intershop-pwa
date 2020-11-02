import { ModuleWithProviders, NgModule } from '@angular/core';

import { FeatureToggleDirective } from './directives/feature-toggle.directive';
import { NotFeatureToggleDirective } from './directives/not-feature-toggle.directive';
import { FeatureToggleService, checkFeature } from './utils/feature-toggle/feature-toggle.service';

@NgModule({
  declarations: [FeatureToggleDirective, NotFeatureToggleDirective],
  exports: [FeatureToggleDirective, NotFeatureToggleDirective],
})
export class FeatureToggleModule {
  private static features: string[];

  static forTesting(...features: string[]): ModuleWithProviders<FeatureToggleModule> {
    FeatureToggleModule.switchTestingFeatures(...features);
    return {
      ngModule: FeatureToggleModule,
      providers: [
        {
          provide: FeatureToggleService,
          useValue: { enabled: (feature: string) => checkFeature(FeatureToggleModule.features, feature) },
        },
      ],
    };
  }

  static switchTestingFeatures(...features: string[]) {
    FeatureToggleModule.features = features;
  }
}

export { FeatureToggleService } from './utils/feature-toggle/feature-toggle.service';
export { FeatureToggleGuard } from './guards/feature-toggle.guard';
