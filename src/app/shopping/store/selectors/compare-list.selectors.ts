import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';

export const getCompareListState = createSelector(
  fromFeature.getShoppingState, (state: fromFeature.ShoppingState) => state.compareList
);

export const getCompareList = createSelector(
  getCompareListState,
  state => state.skus
);

export const isInCompareList = (sku: string) => createSelector(
  getCompareList,
  list => list.includes(sku)
);
