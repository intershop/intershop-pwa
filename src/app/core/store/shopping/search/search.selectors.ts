import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

const getSearchState = createSelector(getShoppingState, (state: ShoppingState) => state.search);

export const getSearchTerm = selectRouteParam('searchTerm');

export const getSuggestSearchResults = createSelector(getSearchState, state => state.suggestions);

export const getSuggestSearchLoading = createSelector(getSearchState, state => state.loading);

export const getSearchServerError = createSelector(getSearchState, state =>
  state.error && (state.error.status >= 500 || state.error.status === 0) ? state.error : undefined
);

export const getSearchedTerms = createSelector(getSearchState, state => state._searchTerms);
