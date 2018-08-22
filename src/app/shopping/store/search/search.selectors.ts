import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from '../shopping.state';

export const getSearchState = createSelector(getShoppingState, (state: ShoppingState) => state.search);

export const getSearchLoading = createSelector(getSearchState, state => state.loading);

export const getSearchTerm = createSelector(getSearchState, state => state.searchTerm);

export const getSuggestSearchResults = createSelector(getSearchState, state => state.suggestSearchResults);
