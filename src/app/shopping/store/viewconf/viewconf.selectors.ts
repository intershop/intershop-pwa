import { createSelector } from '@ngrx/store';
import { getShoppingState, ShoppingState } from '../shopping.state';

export const getViewconfState = createSelector(getShoppingState, (state: ShoppingState) => state.viewconf);

export const getViewType = createSelector(getViewconfState, state => state.viewType);
export const getSortBy = createSelector(getViewconfState, state => state.sortBy);
export const getSortKeys = createSelector(getViewconfState, state => state.sortKeys);

export const getPagingPage = createSelector(getViewconfState, state => state.page || 0);

export const isEndlessScrollingEnabled = createSelector(getViewconfState, state => state.endlessScrollingEnabled);

export const getPagingLoading = createSelector(getViewconfState, state => state.loading);

export const getTotalItems = createSelector(getViewconfState, state => state.total);

export const getItemsPerPage = createSelector(getViewconfState, state => state.itemsPerPage);

export const canRequestMore = createSelector(
  getPagingPage,
  getItemsPerPage,
  getTotalItems,
  (page, itemsPerPage, total) => total < 0 || (page + 1) * itemsPerPage < total
);
