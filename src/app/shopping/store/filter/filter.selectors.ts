import { createSelector } from '@ngrx/store';
import { getShoppingState, ShoppingState } from '../shopping.state';

const getFilterState = createSelector(getShoppingState, (state: ShoppingState) => state.filter);

export const getAvailableFilter = createSelector(getFilterState, state => state.availableFilter);

export const getLoadingStatus = createSelector(getFilterState, state => state.loading);
