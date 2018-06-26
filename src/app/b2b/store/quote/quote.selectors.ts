import { createSelector } from '@ngrx/store';
import { getB2bState } from '../b2b.state';

const getQuoteState = createSelector(getB2bState, state => state.quote);

export const getCurrentQuotes = createSelector(getQuoteState, state => state.quotes);

export const getQuoteLoading = createSelector(getQuoteState, state => state.loading);

export const getQuoteError = createSelector(getQuoteState, state => state.error);
