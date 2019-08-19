import { NgModule } from '@angular/core';

import { FeatureToggleDirective } from './directives/feature-toggle.directive';
import { NotFeatureToggleDirective } from './directives/not-feature-toggle.directive';

@NgModule({
  declarations: [FeatureToggleDirective, NotFeatureToggleDirective],
  exports: [FeatureToggleDirective, NotFeatureToggleDirective],
})
export class FeatureToggleModule {}

export { FeatureToggleService } from './utils/feature-toggle/feature-toggle.service';
export { FeatureToggleGuard } from './guards/feature-toggle.guard';
