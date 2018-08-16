import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from '../shopping.state';

const getFilterState = createSelector(getShoppingState, (state: ShoppingState) => state.filter);

export const getAvailableFilter = createSelector(getFilterState, state => state.availableFilter);

export const getFilterLoading = createSelector(getFilterState, state => state.loading);
