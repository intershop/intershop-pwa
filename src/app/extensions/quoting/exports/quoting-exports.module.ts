import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyBasketAddToQuoteComponent } from './lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';
import { LazyProductAddToQuoteComponent } from './lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { LazyQuoteWidgetComponent } from './lazy-quote-widget/lazy-quote-widget.component';
import { LazyQuotingBasketLineItemsComponent } from './lazy-quoting-basket-line-items/lazy-quoting-basket-line-items.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('quoting', true, {
      location: () => import('../store/quoting-store.module').then(m => m.QuotingStoreModule),
    }),
  ],
  declarations: [
    LazyBasketAddToQuoteComponent,
    LazyProductAddToQuoteComponent,
    LazyQuoteWidgetComponent,
    LazyQuotingBasketLineItemsComponent,
  ],
  exports: [
    LazyBasketAddToQuoteComponent,
    LazyProductAddToQuoteComponent,
    LazyQuoteWidgetComponent,
    LazyQuotingBasketLineItemsComponent,
  ],
})
export class QuotingExportsModule {}
