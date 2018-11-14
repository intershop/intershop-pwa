import { ModuleWithProviders, NgModule } from '@angular/core';

import { FeatureToggleDirective } from './directives/feature-toggle.directive';
import { FeatureToggleService } from './utils/feature-toggle/feature-toggle.service';

@NgModule({
  declarations: [FeatureToggleDirective],
  exports: [FeatureToggleDirective],
})
export class FeatureToggleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FeatureToggleModule,
    };
  }

  static testingFeatures(features: { [feature: string]: boolean }): ModuleWithProviders {
    return {
      ngModule: FeatureToggleModule,
      providers: [{ provide: FeatureToggleService, useFactory: () => new FeatureToggleService(features) }],
    };
  }
}

export { FEATURE_TOGGLES } from './configurations/injection-keys';
export { FeatureToggleService } from './utils/feature-toggle/feature-toggle.service';
export { FeatureToggleGuard } from './guards/feature-toggle.guard';
