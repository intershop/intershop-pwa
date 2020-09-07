import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketAddToQuoteComponent } from './shared/basket-add-to-quote/basket-add-to-quote.component';
import { QuoteEditComponent } from './shared/quote-edit/quote-edit.component';
import { QuoteExpirationDateComponent } from './shared/quote-expiration-date/quote-expiration-date.component';
import { QuoteStateComponent } from './shared/quote-state/quote-state.component';
import { QuoteViewComponent } from './shared/quote-view/quote-view.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    BasketAddToQuoteComponent,
    QuoteEditComponent,
    QuoteExpirationDateComponent,
    QuoteStateComponent,
    QuoteViewComponent,
  ],
  exports: [QuoteEditComponent, QuoteExpirationDateComponent, QuoteStateComponent, QuoteViewComponent, SharedModule],
})
export class Quoting2Module {}
