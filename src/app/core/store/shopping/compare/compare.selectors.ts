import { createSelector } from '@ngrx/store';

import { getProductEntities } from 'ish-core/store/shopping/products';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

export const getCompareState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.compare
);

export const getCompareProductsSKUs = createSelector(
  getCompareState,
  state => state.products
);

export const isInCompareProducts = (sku: string) =>
  createSelector(
    getCompareProductsSKUs,
    productSKUs => productSKUs.includes(sku)
  );

export const getCompareProducts = createSelector(
  getCompareProductsSKUs,
  getProductEntities,
  (productSKUs, productEntities) => productSKUs.map(sku => productEntities[sku])
);

export const getCompareProductsCount = createSelector(
  getCompareProductsSKUs,
  productSKUs => (productSKUs && productSKUs.length) || 0
);
