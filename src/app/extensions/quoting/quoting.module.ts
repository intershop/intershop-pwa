import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketAddToQuoteComponent } from './shared/basket-add-to-quote/basket-add-to-quote.component';
import { ProductAddToQuoteDialogComponent } from './shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { ProductAddToQuoteComponent } from './shared/product-add-to-quote/product-add-to-quote.component';
import { QuoteEditComponent } from './shared/quote-edit/quote-edit.component';
import { QuoteExpirationDateComponent } from './shared/quote-expiration-date/quote-expiration-date.component';
import { QuoteStateComponent } from './shared/quote-state/quote-state.component';
import { QuoteViewComponent } from './shared/quote-view/quote-view.component';
import { QuoteWidgetComponent } from './shared/quote-widget/quote-widget.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    BasketAddToQuoteComponent,
    ProductAddToQuoteComponent,
    ProductAddToQuoteDialogComponent,
    QuoteEditComponent,
    QuoteExpirationDateComponent,
    QuoteStateComponent,
    QuoteViewComponent,
    QuoteWidgetComponent,
  ],
  exports: [
    ProductAddToQuoteComponent,
    QuoteEditComponent,
    QuoteExpirationDateComponent,
    QuoteStateComponent,
    QuoteViewComponent,
    QuoteWidgetComponent,
    SharedModule,
  ],
})
export class QuotingModule {}
