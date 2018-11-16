import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsSharedModule } from '../forms/forms-shared.module';
import { SharedBasketModule } from '../shared/shared-basket.module';
import { SharedModule } from '../shared/shared.module';

import { BasketAddToQuoteComponent } from './components/basket-add-to-quote/basket-add-to-quote.component';
import { ProductAddToQuoteDialogComponent } from './components/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { ProductAddToQuoteComponent } from './components/product-add-to-quote/product-add-to-quote.component';
import { QuoteEditComponent } from './components/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './components/quote-state/quote-state.component';
import { ProductAddToQuoteDialogContainerComponent } from './containers/product-add-to-quote-dialog/product-add-to-quote-dialog.container';

@NgModule({
  imports: [CommonModule, FormsSharedModule, NgbModalModule, SharedBasketModule, SharedModule],
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
