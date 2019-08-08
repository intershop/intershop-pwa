import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { getSelectedProductId } from 'ish-core/store/shopping/products';
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';

const getRecentlyState = createSelector(
  getShoppingState,
  state => state.recently
);

export const getRecentlyViewedProducts = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getRecentlyState, (state): string[] =>
  state.products
    // take only first element of each group
    .filter((val, _, arr) => !val.group || arr.find(el => el.group === val.group) === val)
    .map(e => e.sku)
    // take only first appearance of sku
    .filter((val, idx, arr) => arr.indexOf(val) === idx)
);

/**
 * Selector to get the most recent 4 products without the currently viewed product on product detail pages
 */
export const getMostRecentlyViewedProducts = createSelector(
  getRecentlyViewedProducts,
  getSelectedProductId,
  (skus, selectedSKU): string[] => skus.filter(productSKU => productSKU && productSKU !== selectedSKU).slice(0, 4)
);
