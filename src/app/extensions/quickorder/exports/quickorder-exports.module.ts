import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyDirectOrderComponent } from './lazy-direct-order/lazy-direct-order.component';
import { LazyQuickorderLinkComponent } from './lazy-quickorder-link/lazy-quickorder-link.component';

@NgModule({
  imports: [FeatureToggleModule],

  declarations: [LazyDirectOrderComponent, LazyQuickorderLinkComponent],
  exports: [LazyDirectOrderComponent, LazyQuickorderLinkComponent],
})
export class QuickorderExportsModule {}
