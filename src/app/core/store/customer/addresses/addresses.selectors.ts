import { createSelector } from '@ngrx/store';
import { identity } from 'rxjs';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

import { addressAdapter } from './addresses.reducer';

const getAddressesState = createSelector(getCustomerState, state => state.addresses);

const { selectAll } = addressAdapter.getSelectors(getAddressesState);

export const getAllAddresses = createSelector(selectAll, identity);

export const getAddressesLoading = createSelector(getAddressesState, addresses => addresses.loading);

export const getAddressesError = createSelector(getAddressesState, addresses => addresses.error);
