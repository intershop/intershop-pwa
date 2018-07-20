import { HttpErrorResponse } from '@angular/common/http';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Address } from '../../../models/address/address.model';
import { AddressAction, AddressActionTypes } from './addresses.actions';
import { AddressesState } from './addresses.reducer';

export const addressAdapter = createEntityAdapter<Address>({});

export interface AddressesState extends EntityState<Address> {
  loading: boolean;
  error: HttpErrorResponse;
}

export const initialState: AddressesState = addressAdapter.getInitialState({
  loading: false,
  error: null,
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
        error: null,
        loading: false,
      };
    }

    case AddressActionTypes.ResetAddresses: {
      return initialState;
    }
  }

  return state;
}
