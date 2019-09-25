import { createSelector } from '@ngrx/store';

import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { getCategoryTree } from 'ish-core/store/shopping/categories';
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
  getCategoryTree,
  (productSKUs, productEntities, tree) => productSKUs.map(sku => createProductView(productEntities[sku], tree))
);

export const getCompareProductsCount = createSelector(
  getCompareProductsSKUs,
  productSKUs => (productSKUs && productSKUs.length) || 0
);
