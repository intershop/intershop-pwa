import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { QuoteRequestEffects } from './quote-request/quote-request.effects';
import { quoteRequestReducer } from './quote-request/quote-request.reducer';
import { QuoteEffects } from './quote/quote.effects';
import { quoteReducer } from './quote/quote.reducer';
import { QuotingState } from './quoting-store';

export const quotingReducers: ActionReducerMap<QuotingState> = {
  quote: quoteReducer,
  quoteRequest: quoteRequestReducer,
};

export const quotingEffects = [QuoteEffects, QuoteRequestEffects];

@NgModule({
  imports: [EffectsModule.forFeature(quotingEffects), StoreModule.forFeature('quoting', quotingReducers)],
})
export class QuotingStoreModule {}
