import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import {
  createBasketAddress,
  createBasketAddressSuccess,
  deleteBasketShippingAddress,
  updateBasketAddress,
} from 'ish-core/store/customer/basket';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  createCustomerAddress,
  createCustomerAddressFail,
  createCustomerAddressSuccess,
  deleteCustomerAddress,
  deleteCustomerAddressFail,
  deleteCustomerAddressSuccess,
  loadAddresses,
  loadAddressesFail,
  loadAddressesSuccess,
  updateCustomerAddressFail,
  updateCustomerAddressSuccess,
} from './addresses.actions';

export const addressAdapter = createEntityAdapter<Address>({});

export interface AddressesState extends EntityState<Address> {
  loading: boolean;
  error: HttpError;
}

export const initialState: AddressesState = addressAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const addressesReducer = createReducer(
  initialState,
  setLoadingOn(
    loadAddresses,
    createCustomerAddress,
    createBasketAddress,
    updateBasketAddress,
    deleteCustomerAddress,
    deleteBasketShippingAddress
  ),
  setErrorOn(loadAddressesFail, createCustomerAddressFail, updateCustomerAddressFail, deleteCustomerAddressFail),
  unsetLoadingAndErrorOn(
    loadAddressesSuccess,
    createCustomerAddressSuccess,
    createBasketAddressSuccess,
    updateCustomerAddressSuccess,
    deleteCustomerAddressSuccess
  ),
  on(loadAddressesSuccess, (state, action) => addressAdapter.setAll(action.payload.addresses, state)),
  on(createCustomerAddressSuccess, createBasketAddressSuccess, updateCustomerAddressSuccess, (state, action) =>
    addressAdapter.upsertOne(action.payload.address, state)
  ),
  on(deleteCustomerAddressSuccess, (state, action) => addressAdapter.removeOne(action.payload.addressId, state))
);
