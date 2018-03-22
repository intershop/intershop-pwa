import { createSelector } from '@ngrx/store';
import { getRouterState } from '../../../core/store/router';
import { getProductEntities } from '../products';
import { getShoppingState, ShoppingState } from '../shopping.state';

export const getSearchState = createSelector(
  getShoppingState, (state: ShoppingState) => state.search
);

export const getRequestedSearchTerm = createSelector(
  getRouterState,
  router => router && router.state && router.state.params.searchTerm
);

export const getSearchLoading = createSelector(
  getSearchState,
  state => state.searchLoading
);

export const getSearchTerm = createSelector(getSearchState, state => state.searchTerm);

export const getSearchProducts = createSelector(getSearchState, getProductEntities, (searchState, productsEntities) =>
  searchState.skus.map(sku => productsEntities[sku])
);

export const getSuggestSearchResults = createSelector(getSearchState, state => state.suggestSearchResults);
