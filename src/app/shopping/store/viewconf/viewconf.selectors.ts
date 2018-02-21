import { createSelector } from '@ngrx/store';
import { getShoppingState, ShoppingState } from '../shopping.state';

export const getViewconfState = createSelector(
  getShoppingState, (state: ShoppingState) => state.viewconf
);

/* export const getCompareList = createSelector(
  getViewconfState,
  state => state.skus
);*/
