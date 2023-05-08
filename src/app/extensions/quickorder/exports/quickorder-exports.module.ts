import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyDirectOrderComponent } from './lazy-direct-order/lazy-direct-order.component';
import { LazyQuickorderLinkComponent } from './lazy-quickorder-link/lazy-quickorder-link.component';

@NgModule({
  imports: [FeatureToggleModule],

  declarations: [LazyDirectOrderComponent, LazyQuickorderLinkComponent],
  exports: [LazyDirectOrderComponent, LazyQuickorderLinkComponent],
  providers: [loadFeatureProvider('quickorder', false)],
})
export class QuickorderExportsModule {}
