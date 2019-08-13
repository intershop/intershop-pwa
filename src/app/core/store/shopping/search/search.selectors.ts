import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from '../shopping-store';

import { searchCacheAdapter } from './search.reducer';

export const getSearchState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.search
);

export const {
  selectEntities: getSuggestSearchEntities,
  selectIds: getSuggestSearchTerms,
} = searchCacheAdapter.getSelectors(getSearchState);

export const getSearchLoading = createSelector(
  getSearchState,
  state => state.loading
);

export const getSearchTerm = createSelector(
  getSearchState,
  state => state.searchTerm
);

export const getCurrentSearchboxId = createSelector(
  getSearchState,
  state => state.currentSearchboxId
);

export const getSuggestSearchResult = createSelector(
  getSearchState,
  state => state.suggestSearchResults
);

export const getSuggestSearchResults = createSelector(
  getSuggestSearchEntities,
  (entities, props: { term: string }) => entities[props.term]
);
