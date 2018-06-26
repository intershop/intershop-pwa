import { ActionReducerMap } from '@ngrx/store';
import { QuoteRequestEffects } from './quote-request/quote-request.effects';
import { quoteRequestReducer } from './quote-request/quote-request.reducer';
import { QuoteEffects } from './quote/quote.effects';
import { quoteReducer } from './quote/quote.reducer';
import { QuotingState } from './quoting.state';

export const quotingReducers: ActionReducerMap<QuotingState> = {
  quote: quoteReducer,
  quoteRequest: quoteRequestReducer,
};

export const quotingEffects = [QuoteEffects, QuoteRequestEffects];
