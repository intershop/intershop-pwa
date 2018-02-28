import { createSelector } from '@ngrx/store';
import * as productsSelectors from '../products/products.selectors';
import { getShoppingState, ShoppingState } from '../shopping.state';

export const getRecentlyState = createSelector(
  getShoppingState, (state: ShoppingState) => state.recently
);

export const getRecentlyProducts = createSelector(
  getRecentlyState,
  state => state.products
);

export const getRecentlyViewedProducts = createSelector(
  getRecentlyProducts,
  productsSelectors.getProductEntities,
  (productSKUs, products) => productSKUs
    && productSKUs.map(sku => products[sku]) || []
);
