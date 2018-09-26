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

const getMostRecentlyViewedProductSKUs = createSelector(
  getRecentlyProducts,
  getSelectedProductId,
  (skus, selectedSKU) => skus.filter(productSKU => productSKU && productSKU !== selectedSKU).slice(0, 4)
);

/**
 * Selector to get the most recent 4 products without the currently viewed product on product detail pages
 */
export const getMostRecentlyViewedProducts = createSelector(
  getMostRecentlyViewedProductSKUs,
  getProductEntities,
  (skus, products) => skus.map(sku => products[sku])
);
