import { createSelector } from '@ngrx/store';

import { getSelectedProductId } from '../products';
import { getShoppingState } from '../shopping-store';

const getRecentlyState = createSelector(
  getShoppingState,
  state => state.recently
);

export const getRecentlyViewedProducts = createSelector(
  getRecentlyState,
  state => state.products
);

/**
 * Selector to get the most recent 4 products without the currently viewed product on product detail pages
 */
export const getMostRecentlyViewedProducts = createSelector(
  getRecentlyViewedProducts,
  getSelectedProductId,
  (skus, selectedSKU) => skus.filter(productSKU => productSKU && productSKU !== selectedSKU).slice(0, 4)
);
