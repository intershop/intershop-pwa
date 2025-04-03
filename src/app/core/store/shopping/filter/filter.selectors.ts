import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

const getFilterState = createSelector(getShoppingState, (state: ShoppingState) => state.filter);

export const getAvailableFilter = createSelector(getFilterState, state => state.availableFilter);

export const getFilterById = (filterId: string) =>
  createSelector(getAvailableFilter, state => state.filter.find(element => element.id === filterId));
