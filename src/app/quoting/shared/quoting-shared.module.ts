import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { BasketAddToQuoteComponent } from './components/basket-add-to-quote/basket-add-to-quote.component';
import { ProductAddToQuoteDialogComponent } from './components/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { ProductAddToQuoteComponent } from './components/product-add-to-quote/product-add-to-quote.component';
import { QuoteEditComponent } from './components/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './components/quote-state/quote-state.component';
import { ProductAddToQuoteDialogContainerComponent } from './containers/product-add-to-quote-dialog/product-add-to-quote-dialog.container';

@NgModule({
  imports: [SharedModule],
  declarations: [
    BasketAddToQuoteComponent,
    ProductAddToQuoteComponent,
    ProductAddToQuoteDialogComponent,
    ProductAddToQuoteDialogContainerComponent,
    QuoteEditComponent,
    QuoteStateComponent,
  ],
  exports: [
    BasketAddToQuoteComponent,
    ProductAddToQuoteComponent,
    ProductAddToQuoteDialogComponent,
    ProductAddToQuoteDialogContainerComponent,
    QuoteEditComponent,
    QuoteStateComponent,
  ],
  entryComponents: [ProductAddToQuoteDialogContainerComponent],
})
export class QuotingSharedModule {}
