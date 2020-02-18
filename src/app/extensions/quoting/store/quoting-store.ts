import { QuoteRequestState } from './quote-request/quote-request.reducer';
import { QuoteState } from './quote/quote.reducer';

export interface QuotingState {
  quote: QuoteState;
  quoteRequest: QuoteRequestState;
}

// TODO: use createFeatureSelector after ivy dynamic loading
// tslint:disable-next-line: no-any
export const getQuotingState: (state: any) => QuotingState = state => state.quoting;
