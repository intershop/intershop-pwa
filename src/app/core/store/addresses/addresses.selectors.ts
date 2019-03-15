import { createSelector } from '@ngrx/store';

import { getCoreState } from '../core-store';

import { addressAdapter } from './addresses.reducer';

const getAddressesState = createSelector(
  getCoreState,
  state => state.addresses
);

export const { selectEntities: getAddressEntities, selectAll: getAllAddresses } = addressAdapter.getSelectors(
  getAddressesState
);

export const getAddressesLoading = createSelector(
  getAddressesState,
  addresses => addresses.loading
);

export const getAddressesError = createSelector(
  getAddressesState,
  addresses => addresses.error
);
