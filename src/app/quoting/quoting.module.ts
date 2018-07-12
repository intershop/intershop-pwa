import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { QuotingRoutingModule } from './quoting-routing.module';
import { QuoteRequestService } from './services/quote-request/quote-request.service';
import { QuoteService } from './services/quote/quote.service';
import { quotingEffects, quotingReducers } from './store/quoting.system';

@NgModule({
  imports: [
    QuotingRoutingModule,
    StoreModule.forFeature('quoting', quotingReducers),
    EffectsModule.forFeature(quotingEffects),
  ],
  providers: [QuoteService, QuoteRequestService],
})
export class QuotingModule {}
