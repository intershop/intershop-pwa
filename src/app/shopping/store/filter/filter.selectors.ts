import { createSelector } from '@ngrx/store';
import { getProductEntities } from '../products';
import { getShoppingState, ShoppingState } from '../shopping.state';

const getFilterState = createSelector(getShoppingState, (state: ShoppingState) => state.filter);

export const getAvailableFilter = createSelector(getFilterState, state => state.availablefilter);

export const getFilteredProductSkus = createSelector(getFilterState, state => state.products);

export const getFilteredProducts = createSelector(
  getFilteredProductSkus,
  getProductEntities,
  (skus, products) => (skus && skus.map(sku => products[sku])) || null
);
