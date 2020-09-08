import { createSelector } from '@ngrx/store';

import { getQuotingState } from '../quoting-store';

import { quotingAdapter } from './quoting.reducer';

const getQuotingInternalState = createSelector(getQuotingState, state => state.quoting);

export const getQuotingLoading = createSelector(getQuotingInternalState, state => !!state.loading);

export const getQuotingError = createSelector(getQuotingInternalState, state => state.error);

const { selectAll, selectEntities } = quotingAdapter.getSelectors(getQuotingInternalState);

export const getQuotingEntities = selectAll;

export const getQuotingEntity = (id: string) => createSelector(selectEntities, entities => entities[id]);

export const getActiveQuoteRequestId = createSelector(getQuotingInternalState, state => state.activeQuoteRequest);

export const isQuotingInitialized = createSelector(getQuotingInternalState, state => state.initialized);
