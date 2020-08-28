import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { QuoteExpirationDateComponent } from './shared/quote-expiration-date/quote-expiration-date.component';
import { QuoteStateComponent } from './shared/quote-state/quote-state.component';

@NgModule({
  imports: [SharedModule],
  declarations: [QuoteExpirationDateComponent, QuoteStateComponent],
  exports: [QuoteExpirationDateComponent, QuoteStateComponent, SharedModule],
})
export class Quoting2Module {}
