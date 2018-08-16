import { createSelector } from '@ngrx/store';

import { getProductEntities, getSelectedProductId } from '../products';
import { getShoppingState } from '../shopping.state';

const getRecentlyState = createSelector(getShoppingState, state => state.recently);

export const getRecentlyProducts = createSelector(getRecentlyState, state => state.products);

export const getRecentlyViewedProducts = createSelector(
  getRecentlyProducts,
  getProductEntities,
  (productSKUs, products) => (productSKUs && productSKUs.map(sku => products[sku])) || []
);

/**
 * Selector to get the most recent 4 products without the currently viewed product on product detail pages
 */
export const getMostRecentlyViewedProducts = createSelector(
  getRecentlyViewedProducts,
  getSelectedProductId,
  (products, sku) => products.filter(product => product && product.sku !== sku).slice(0, 4)
);
