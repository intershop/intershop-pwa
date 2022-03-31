import { createSelector } from '@ngrx/store';

import { getCompareState } from '../compare-store';

export const getCompareProductsSKUs = createSelector(getCompareState, state => state._compare);

export const isInCompareProducts = (sku: string) =>
  createSelector(getCompareProductsSKUs, productSKUs => productSKUs.includes(sku));

export const getCompareProductsCount = createSelector(getCompareProductsSKUs, productSKUs => productSKUs?.length || 0);
