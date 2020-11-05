import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { RecentlyState } from './recently.reducer';

const getRecentlyState = createSelector(getShoppingState, state => state.recently);

export const getRecentlyViewedProducts = createSelectorFactory<unknown, string[]>(projector =>
  defaultMemoize(projector, undefined, isEqual)
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
  (skus: string[], selected): string[] =>
    selected ? skus.filter(productSKU => productSKU && productSKU !== selected.sku).slice(0, 4) : skus.slice(0, 4)
);
