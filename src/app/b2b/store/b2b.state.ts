import { createFeatureSelector } from '@ngrx/store';
import { QuoteState } from './quote/quote.reducer';

export interface B2bState {
  quote: QuoteState;
}

export const getB2bState = createFeatureSelector<B2bState>('b2b');
