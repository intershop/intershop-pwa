import { createSelector } from '@ngrx/store';

import { getStoreLocatorState } from '../store-locator-store';

import { initialState, storesAdapter } from './stores.reducer';

const getStoresState = createSelector(getStoreLocatorState, state => state?.stores ?? initialState);

const { selectEntities, selectAll } = storesAdapter.getSelectors(getStoresState);

export const getStores = selectAll;

export const getLoading = createSelector(getStoresState, state => state.loading);

export const getError = createSelector(getStoresState, state => state.error);

const getHightlightedStoreId = createSelector(getStoresState, state => state.highlighted);

export const getHighlightedStore = createSelector(
  selectEntities,
  getHightlightedStoreId,
  (entities, highlightedId) => entities[highlightedId]
);
