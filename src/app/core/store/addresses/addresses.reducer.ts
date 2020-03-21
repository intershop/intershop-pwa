import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketAction, BasketActionTypes } from 'ish-core/store/checkout/basket';

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
    case BasketActionTypes.CreateBasketAddress:
    case BasketActionTypes.UpdateBasketAddress:
    case AddressActionTypes.DeleteCustomerAddress:
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
      const { error } = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case AddressActionTypes.LoadAddressesSuccess: {
      const { addresses } = action.payload;

      return {
        ...addressAdapter.setAll(addresses, state),
        error: undefined,
        loading: false,
      };
    }

    case AddressActionTypes.CreateCustomerAddressSuccess:
    case BasketActionTypes.CreateBasketAddressSuccess: {
      const { address } = action.payload;

      return {
        ...addressAdapter.addOne(address, state),
        loading: false,
        error: undefined,
      };
    }

    case AddressActionTypes.UpdateCustomerAddressSuccess: {
      const { address } = action.payload;

      return {
        ...addressAdapter.updateOne({ id: address.id, changes: address }, state),
        loading: false,
        error: undefined,
      };
    }

    case AddressActionTypes.DeleteCustomerAddressSuccess: {
      const { addressId } = action.payload;

      return {
        ...addressAdapter.removeOne(addressId, state),
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
