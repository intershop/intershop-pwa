import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsSharedModule } from '../forms/forms-shared.module';
import { SharedLineItemListModule } from '../shared/shared-line-item-list.module';
import { SharedModule } from '../shared/shared.module';
import { ProductAddToQuoteComponent } from './components/product-add-to-quote/product-add-to-quote.component';
import { QuoteEditComponent } from './components/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './components/quote-state/quote-state.component';

@NgModule({
  imports: [CommonModule, FormsSharedModule, SharedModule, SharedLineItemListModule],
  declarations: [ProductAddToQuoteComponent, QuoteStateComponent, QuoteEditComponent],
  exports: [ProductAddToQuoteComponent, QuoteStateComponent, QuoteEditComponent],
})
export class QuotingSharedModule {}
