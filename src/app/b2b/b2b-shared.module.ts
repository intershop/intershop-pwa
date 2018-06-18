import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProductAddToQuoteComponent } from './components/product-add-to-quote/product-add-to-quote.component';
import { QuoteStateComponent } from './components/quote-state/quote-state.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ProductAddToQuoteComponent, QuoteStateComponent],
  exports: [ProductAddToQuoteComponent, QuoteStateComponent],
})
export class B2bSharedModule {}
