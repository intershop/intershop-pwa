import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedLineItemListModule } from '../shared/shared-line-item-list.module';
import { SharedModule } from '../shared/shared.module';
import { ProductAddToQuoteComponent } from './components/product-add-to-quote/product-add-to-quote.component';
import { QuoteEditComponent } from './components/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './components/quote-state/quote-state.component';

@NgModule({
  imports: [CommonModule, SharedModule, SharedLineItemListModule],
  declarations: [ProductAddToQuoteComponent, QuoteStateComponent, QuoteEditComponent],
  exports: [ProductAddToQuoteComponent, QuoteStateComponent, QuoteEditComponent],
})
export class QuotingSharedModule {}
