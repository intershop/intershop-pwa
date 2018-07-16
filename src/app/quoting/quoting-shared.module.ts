import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsSharedModule } from '../forms/forms-shared.module';
import { SharedLineItemListModule } from '../shared/shared-line-item-list.module';
import { SharedModule } from '../shared/shared.module';
import { BasketAddToQuoteComponent } from './components/basket-add-to-quote/basket-add-to-quote.component';
import { ProductAddToQuoteComponent } from './components/product-add-to-quote/product-add-to-quote.component';
import { QuoteEditComponent } from './components/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './components/quote-state/quote-state.component';

@NgModule({
  imports: [CommonModule, FormsSharedModule, SharedModule, SharedLineItemListModule],
  declarations: [BasketAddToQuoteComponent, ProductAddToQuoteComponent, QuoteStateComponent, QuoteEditComponent],
  exports: [BasketAddToQuoteComponent, ProductAddToQuoteComponent, QuoteStateComponent, QuoteEditComponent],
})
export class QuotingSharedModule {}
