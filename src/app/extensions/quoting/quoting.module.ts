import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { QuoteWidgetComponent } from './shared/account/quote-widget/quote-widget.component';
import { BasketAddToQuoteComponent } from './shared/basket/basket-add-to-quote/basket-add-to-quote.component';
import { ProductAddToQuoteDialogComponent } from './shared/product/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { ProductAddToQuoteComponent } from './shared/product/product-add-to-quote/product-add-to-quote.component';
import { QuoteEditComponent } from './shared/quote/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './shared/quote/quote-state/quote-state.component';
import { QuotingStoreModule } from './store/quoting-store.module';

@NgModule({
  imports: [QuotingStoreModule, SharedModule],
  declarations: [
    BasketAddToQuoteComponent,
    ProductAddToQuoteComponent,
    ProductAddToQuoteDialogComponent,
    QuoteEditComponent,
    QuoteStateComponent,
    QuoteWidgetComponent,
  ],
  exports: [QuoteEditComponent, QuoteStateComponent, SharedModule],
  entryComponents: [
    BasketAddToQuoteComponent,
    ProductAddToQuoteComponent,
    ProductAddToQuoteDialogComponent,
    QuoteWidgetComponent,
  ],
})
export class QuotingModule {}
