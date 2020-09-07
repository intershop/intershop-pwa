import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAddToQuoteDialogComponent } from './shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { QuoteEditComponent } from './shared/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './shared/quote-state/quote-state.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ProductAddToQuoteDialogComponent, QuoteEditComponent, QuoteStateComponent],
  exports: [QuoteEditComponent, QuoteStateComponent, SharedModule],
})
export class QuotingModule {}
