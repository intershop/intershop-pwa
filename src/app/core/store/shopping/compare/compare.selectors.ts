import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

const getCompareState = createSelector(getShoppingState, (state: ShoppingState) => state.compare);

export const getCompareProductsSKUs = createSelector(getCompareState, state => state.products);

export const isInCompareProducts = (sku: string) =>
  createSelector(getCompareProductsSKUs, productSKUs => productSKUs.includes(sku));

export const getCompareProductsCount = createSelector(
  getCompareProductsSKUs,
  productSKUs => (productSKUs && productSKUs.length) || 0
);
