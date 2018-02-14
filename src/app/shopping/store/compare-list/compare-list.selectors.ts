import { createSelector } from '@ngrx/store';
import { getShoppingState, ShoppingState } from '../shopping.state';

export const getCompareListState = createSelector(
  getShoppingState, (state: ShoppingState) => state.compareList
);

export const getCompareList = createSelector(
  getCompareListState,
  state => state.skus
);

export const isInCompareList = (sku: string) => createSelector(
  getCompareList,
  list => list.includes(sku)
);
