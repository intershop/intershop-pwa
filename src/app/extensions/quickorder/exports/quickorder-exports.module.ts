import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyDirectOrderComponent } from './lazy-direct-order/lazy-direct-order.component';
import { LazyHeaderQuickorderComponent } from './lazy-header-quickorder/lazy-header-quickorder.component';

@NgModule({
  imports: [FeatureToggleModule],

  declarations: [LazyDirectOrderComponent, LazyHeaderQuickorderComponent],
  exports: [LazyDirectOrderComponent, LazyHeaderQuickorderComponent],
})
export class QuickorderExportsModule {}
