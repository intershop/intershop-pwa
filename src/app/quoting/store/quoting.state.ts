import { createFeatureSelector } from '@ngrx/store';

import { QuoteRequestState } from './quote-request/quote-request.reducer';
import { QuoteState } from './quote/quote.reducer';

export interface QuotingState {
  quote: QuoteState;
  quoteRequest: QuoteRequestState;
}

export const getQuotingState = createFeatureSelector<QuotingState>('quoting');
