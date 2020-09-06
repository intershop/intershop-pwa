import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyBasketAddToQuoteComponent } from './lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';

@NgModule({
  imports: [FeatureToggleModule],
  declarations: [LazyBasketAddToQuoteComponent],
  exports: [LazyBasketAddToQuoteComponent],
})
export class Quoting2ExportsModule {}
