import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAddToQuoteDialogComponent } from './shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { ProductAddToQuoteComponent } from './shared/product-add-to-quote/product-add-to-quote.component';
import { QuoteEditComponent } from './shared/quote-edit/quote-edit.component';
import { QuoteStateComponent } from './shared/quote-state/quote-state.component';
import { QuoteWidgetComponent } from './shared/quote-widget/quote-widget.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ProductAddToQuoteComponent,
    ProductAddToQuoteDialogComponent,
    QuoteEditComponent,
    QuoteStateComponent,
    QuoteWidgetComponent,
  ],
  exports: [QuoteEditComponent, QuoteStateComponent, SharedModule],
})
export class QuotingModule {}
