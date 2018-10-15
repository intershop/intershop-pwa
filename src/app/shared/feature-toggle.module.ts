import { ModuleWithProviders, NgModule } from '@angular/core';

import { FeatureToggleDirective } from './feature-toggle/directives/feature-toggle.directive';
import { FeatureToggleGuard } from './feature-toggle/guards/feature-toggle.guard';
import { FeatureToggleService } from './feature-toggle/services/feature-toggle.service';

@NgModule({
  declarations: [FeatureToggleDirective],
  exports: [FeatureToggleDirective],
})
export class FeatureToggleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FeatureToggleModule,
      providers: [FeatureToggleGuard],
    };
  }

  static testingFeatures(features: { [feature: string]: boolean }): ModuleWithProviders {
    return {
      ngModule: FeatureToggleModule,
      providers: [{ provide: FeatureToggleService, useFactory: () => new FeatureToggleService(features) }],
    };
  }
}
