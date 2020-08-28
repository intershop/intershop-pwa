import { createSelector } from '@ngrx/store';

import { getQuoting2State } from '../quoting2-store';

import { quotingAdapter } from './quoting.reducer';

const getQuotingState = createSelector(getQuoting2State, state => state.quoting);

export const getQuotingLoading = createSelector(getQuotingState, state => !!state.loading);

export const getQuotingError = createSelector(getQuotingState, state => state.error);

export const { selectAll: getQuotingEntities } = quotingAdapter.getSelectors(getQuotingState);
