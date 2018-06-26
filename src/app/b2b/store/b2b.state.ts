import { createFeatureSelector } from '@ngrx/store';
import { QuoteRequestState } from './quote-request/quote-request.reducer';
import { QuoteState } from './quote/quote.reducer';

export interface B2bState {
  quote: QuoteState;
  quoteRequest: QuoteRequestState;
}

export const getB2bState = createFeatureSelector<B2bState>('b2b');
