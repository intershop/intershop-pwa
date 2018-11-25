import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';

import { BasketAddToQuoteComponent } from './basket/components/basket-add-to-quote/basket-add-to-quote.component';
import { ProductAddToQuoteDialogComponent } from './product/components/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { ProductAddToQuoteComponent } from './product/components/product-add-to-quote/product-add-to-quote.component';
import { ProductAddToQuoteDialogContainerComponent } from './product/containers/product-add-to-quote-dialog/product-add-to-quote-dialog.container';
import { QuoteEditComponent } from './quote/components/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './quote/components/quote-state/quote-state.component';

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
