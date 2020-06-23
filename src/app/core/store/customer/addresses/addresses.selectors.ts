import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

import { addressAdapter } from './addresses.reducer';

const getAddressesState = createSelector(getCustomerState, state => state.addresses);

export const { selectAll: getAllAddresses } = addressAdapter.getSelectors(getAddressesState);

export const getAddressesLoading = createSelector(getAddressesState, addresses => addresses.loading);

export const getAddressesError = createSelector(getAddressesState, addresses => addresses.error);
