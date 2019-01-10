import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketAction, BasketActionTypes } from '../basket';

import { AddressAction, AddressActionTypes } from './addresses.actions';

export const addressAdapter = createEntityAdapter<Address>({});

export interface AddressesState extends EntityState<Address> {
  loading: boolean;
  error: HttpError;
}

export const initialState: AddressesState = addressAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export function addressesReducer(state = initialState, action: AddressAction | BasketAction): AddressesState {
  switch (action.type) {
    case AddressActionTypes.LoadAddresses:
    case AddressActionTypes.CreateCustomerAddress:
    case BasketActionTypes.CreateBasketInvoiceAddress:
    case BasketActionTypes.CreateBasketShippingAddress:
    case BasketActionTypes.UpdateBasketCustomerAddress:
    case BasketActionTypes.DeleteBasketShippingAddress: {
      return {
        ...state,
        loading: true,
      };
    }

    case AddressActionTypes.LoadAddressesFail:
    case AddressActionTypes.CreateCustomerAddressFail:
    case AddressActionTypes.UpdateCustomerAddressFail:
    case AddressActionTypes.DeleteCustomerAddressFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case AddressActionTypes.LoadAddressesSuccess: {
      const loadedAddresses = action.payload;

      return {
        ...addressAdapter.addAll(loadedAddresses, state),
        error: undefined,
        loading: false,
      };
    }

    case AddressActionTypes.CreateCustomerAddressSuccess:
    case BasketActionTypes.CreateBasketInvoiceAddressSuccess:
    case BasketActionTypes.CreateBasketShippingAddressSuccess: {
      const payload = action.payload;

      return {
        ...addressAdapter.addOne(payload, state),
        loading: false,
        error: undefined,
      };
    }

    case AddressActionTypes.UpdateCustomerAddressSuccess: {
      const payload = action.payload;

      return {
        ...addressAdapter.updateOne({ id: payload.id, changes: payload }, state),
        loading: false,
        error: undefined,
      };
    }

    case AddressActionTypes.DeleteCustomerAddressSuccess: {
      const payload = action.payload;

      return {
        ...addressAdapter.removeOne(payload, state),
        loading: false,
        error: undefined,
      };
    }

    case AddressActionTypes.ResetAddresses: {
      return initialState;
    }
  }

  return state;
}
