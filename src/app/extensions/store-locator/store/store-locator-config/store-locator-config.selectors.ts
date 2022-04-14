import { createSelector } from '@ngrx/store';

import { getStoreLocatorState } from '../store-locator-store';

import { initialState } from './store-locator-config.reducer';

const getStoreLocatorConfigState = createSelector(
  getStoreLocatorState,
  state => state?.storeLocatorConfig ?? initialState
);

export const getGMAKey = createSelector(getStoreLocatorConfigState, state => state.gmaKey);
