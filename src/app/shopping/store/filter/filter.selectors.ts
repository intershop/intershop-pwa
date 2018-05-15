import { createSelector } from '@ngrx/store';
import { getProductEntities } from '../products';
import { getShoppingState, ShoppingState } from '../shopping.state';

const getFilterState = createSelector(getShoppingState, (state: ShoppingState) => state.filter);

const getFilteredProductSkus = createSelector(getFilterState, state => state.products);

export const getAvailableFilter = createSelector(getFilterState, state => state.availableFilter);

export const getLoadingStatus = createSelector(getFilterState, state => state.loading);

export const getFilteredProducts = createSelector(
  getFilteredProductSkus,
  getProductEntities,
  (skus, products) => (skus && skus.map(sku => products[sku])) || null
);

export const getNumberOfFilteredProducts = createSelector(getFilteredProductSkus, skus => (!!skus ? skus.length : 0));
