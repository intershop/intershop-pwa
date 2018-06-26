import { ActionReducerMap } from '@ngrx/store';
import { B2bState } from './b2b.state';
import { QuoteRequestEffects } from './quote-request/quote-request.effects';
import { quoteRequestReducer } from './quote-request/quote-request.reducer';
import { QuoteEffects } from './quote/quote.effects';
import { quoteReducer } from './quote/quote.reducer';

export const b2bReducers: ActionReducerMap<B2bState> = {
  quote: quoteReducer,
  quoteRequest: quoteRequestReducer,
};

export const b2bEffects = [QuoteEffects, QuoteRequestEffects];
