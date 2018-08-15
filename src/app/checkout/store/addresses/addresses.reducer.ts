import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Address } from '../../../models/address/address.model';
import { HttpError } from '../../../models/http-error/http-error.model';
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

export function addressesReducer(state = initialState, action: AddressAction): AddressesState {
  switch (action.type) {
    case AddressActionTypes.LoadAddresses: {
      return {
        ...state,
        loading: true,
      };
    }

    case AddressActionTypes.LoadAddressesFail: {
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

    case AddressActionTypes.ResetAddresses: {
      return initialState;
    }
  }

  return state;
}
