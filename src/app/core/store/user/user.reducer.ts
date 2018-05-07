import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../../../models/customer/customer.model';
import { PrivateCustomer } from '../../../models/customer/private-customer.model';
import { SmbCustomerUser } from '../../../models/customer/smb-customer-user.model';
import { UserAction, UserActionTypes } from './user.actions';

export interface UserState {
  customer: Customer;
  user: PrivateCustomer | SmbCustomerUser;
  authorized: boolean;
  error: HttpErrorResponse;
}

export const getCustomer = (state: UserState) => state.customer;
export const getUser = (state: UserState) => state.user;
export const getAuthorized = (state: UserState) => state.authorized;
export const getError = (state: UserState) => state.error;

export const initialState: UserState = {
  customer: null,
  user: null,
  authorized: false,
  error: undefined,
};

export function userReducer(state = initialState, action: UserAction): UserState {
  switch (action.type) {
    case UserActionTypes.UserErrorReset: {
      return {
        ...state,
        error: undefined,
      };
    }

    case UserActionTypes.LoginUser:
    case UserActionTypes.LogoutUser:
    case UserActionTypes.CreateUserFail: {
      return initialState;
    }

    case UserActionTypes.LoginUserFail:
    case UserActionTypes.LoadCompanyUserFail: {
      const error = action.payload;

      return {
        ...initialState,
        error: error,
      };
    }

    case UserActionTypes.LoginUserSuccess: {
      const payload = action.payload;
      let newState;

      newState = {
        ...initialState,
        authorized: true,
        customer: payload,
      };

      if (payload.type === 'PrivateCustomer') {
        newState.user = payload;
      }

      return newState;
    }

    case UserActionTypes.LoadCompanyUserSuccess: {
      const payload = action.payload;

      return {
        ...state,
        user: payload,
      };
    }
  }

  return state;
}
