import { createSelector } from '@ngrx/store';
import { getProductEntities } from '../products';
import { getShoppingState, ShoppingState } from '../shopping.state';

export const getCompareState = createSelector(
  getShoppingState, (state: ShoppingState) => state.compare
);

export const getCompareList = createSelector(
  getCompareState,
  state => state.skus
);

export const isInCompareList = (sku: string) => createSelector(
  getCompareList,
  list => list.includes(sku)
);

export const getCompareProducts = createSelector(
  getCompareList,
  getProductEntities,
  (productSKUs, productEntities) => productSKUs.map(sku => productEntities[sku])
);
