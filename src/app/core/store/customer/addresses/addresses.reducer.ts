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
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

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
  on(loadAddressesSuccess, (state: AddressesState, action) => {
    const { addresses } = action.payload;

    return {
      ...addressAdapter.setAll(addresses, state),
      error: undefined,
      loading: false,
    };
  }),
  on(createCustomerAddressSuccess, createBasketAddressSuccess, (state: AddressesState, action) => {
    const { address } = action.payload;

    return {
      ...addressAdapter.addOne(address, state),
      loading: false,
      error: undefined,
    };
  }),
  on(updateCustomerAddressSuccess, (state: AddressesState, action) => {
    const { address } = action.payload;

    return {
      ...addressAdapter.updateOne({ id: address.id, changes: address }, state),
      loading: false,
      error: undefined,
    };
  }),
  on(deleteCustomerAddressSuccess, (state: AddressesState, action) => {
    const { addressId } = action.payload;

    return {
      ...addressAdapter.removeOne(addressId, state),
      loading: false,
      error: undefined,
    };
  })
);
