import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';

import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { isArrayEqual } from 'ish-core/utils/functions';

import { getRecentlyState } from '../recently-store';

import { RecentlyViewedProducts } from './recently.reducer';

const internalProducts = createSelector(getRecentlyState, state => state._recently);

export const getRecentlyViewedProducts = createSelectorFactory<object, string[]>(projector =>
  resultMemoize(projector, isArrayEqual)
)(internalProducts, (products: RecentlyViewedProducts): string[] =>
  products
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
