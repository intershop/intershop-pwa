import { createSelector } from '@ngrx/store';

import { getAccountState } from 'ish-core/store/account/account-store';

import { addressAdapter } from './addresses.reducer';

const getAddressesState = createSelector(getAccountState, state => state.addresses);

export const { selectAll: getAllAddresses } = addressAdapter.getSelectors(getAddressesState);

export const getAddressesLoading = createSelector(getAddressesState, addresses => addresses.loading);

export const getAddressesError = createSelector(getAddressesState, addresses => addresses.error);
