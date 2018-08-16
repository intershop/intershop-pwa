import { createSelector } from '@ngrx/store';

import { getProductEntities } from '../products';
import { ShoppingState, getShoppingState } from '../shopping.state';

export const getCompareState = createSelector(getShoppingState, (state: ShoppingState) => state.compare);

export const getCompareProductsSKUs = createSelector(getCompareState, state => state.products);

export const isInCompareProducts = (sku: string) =>
  createSelector(getCompareProductsSKUs, productSKUs => productSKUs.includes(sku));

export const getCompareProducts = createSelector(
  getCompareProductsSKUs,
  getProductEntities,
  (productSKUs, productEntities) => productSKUs.map(sku => productEntities[sku])
);

export const getCompareProductsCount = createSelector(
  getCompareProductsSKUs,
  productSKUs => (productSKUs && productSKUs.length) || 0
);

export function getCompareProductsByCurrentPageAndItemsPerPage(currentPage: number, itemsPerPage: number) {
  return createSelector(getCompareProducts, compareProducts => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return compareProducts.slice(start, end);
  });
}
