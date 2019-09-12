import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { searchAdapter } from './search.reducer';

export const getSearchState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.search
);

export const {
  selectEntities: getSuggestSearchEntities,
  selectIds: getSuggestSearchTerms,
} = searchAdapter.getSelectors(getSearchState);

export const getSearchTerm = createSelector(
  getSearchState,
  state => state.searchTerm
);

export const getSuggestSearchTerm = createSelector(
  getSearchState,
  state => state.suggestSearchTerm
);

export const getSuggestSearchResult = createSelector(
  getSearchState,
  state => state.suggestSearchResults
);

export const getSuggestSearchResults = createSelector(
  getSuggestSearchEntities,
  (entities, props: { suggestSearchTerm: string }) => entities[props.suggestSearchTerm]
);

export const getCurrentSearchBoxId = createSelector(
  getSearchState,
  state => state.currentSearchBoxId
);
