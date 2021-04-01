import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';

import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';
import { isArrayEqual } from 'ish-core/utils/functions';

import { RecentlyState } from './recently.reducer';

const getRecentlyState = createSelector(getShoppingState, state => state.recently);

export const getRecentlyViewedProducts = createSelectorFactory<object, string[]>(projector =>
  resultMemoize(projector, isArrayEqual)
)(getRecentlyState, (state: RecentlyState): string[] =>
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
  getSelectedProduct,
  (skus, selected): string[] =>
    selected ? skus.filter(productSKU => productSKU && productSKU !== selected.sku).slice(0, 4) : skus.slice(0, 4)
);
