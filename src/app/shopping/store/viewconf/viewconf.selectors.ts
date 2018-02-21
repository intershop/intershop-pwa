import { createSelector } from '@ngrx/store';
import { getShoppingState, ShoppingState } from '../shopping.state';

export const getViewconfState = createSelector(
  getShoppingState, (state: ShoppingState) => state.viewconf
);

export const getViewType = createSelector(getViewconfState, state => state.viewType);
export const getSortBy = createSelector(getViewconfState, state => state.sortBy);
