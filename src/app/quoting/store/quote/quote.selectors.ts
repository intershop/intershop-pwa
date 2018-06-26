import { createSelector } from '@ngrx/store';
import { getQuotingState } from '../quoting.state';

const getQuoteState = createSelector(getQuotingState, state => state.quote);

export const getCurrentQuotes = createSelector(getQuoteState, state => state.quotes);

export const getQuoteLoading = createSelector(getQuoteState, state => state.loading);

export const getQuoteError = createSelector(getQuoteState, state => state.error);
