import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyHeaderQuickorderComponent } from './lazy-header-quickorder/lazy-header-quickorder.component';

@NgModule({
  imports: [FeatureToggleModule],

  declarations: [LazyHeaderQuickorderComponent],
  exports: [LazyHeaderQuickorderComponent],
})
export class QuickorderExportsModule {}
