import { createSelector } from '@ngrx/store';
import { getShoppingState, ShoppingState } from '../shopping.state';

export const getViewconfState = createSelector(getShoppingState, (state: ShoppingState) => state.viewconf);

export const getViewType = createSelector(getViewconfState, state => state.viewType);
export const getSortBy = createSelector(getViewconfState, state => state.sortBy);
export const getSortKeys = createSelector(getViewconfState, state => state.sortKeys);

export const getPagingPage = createSelector(getViewconfState, state => state.page);

export const getTotalItems = createSelector(getViewconfState, state => state.total);

export const canRequestMore = (itemsPerPage: number) =>
  createSelector(getViewconfState, state => state.total < 0 || (state.page + 1) * itemsPerPage < state.total);
