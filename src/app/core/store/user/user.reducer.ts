import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../../../models/customer/customer.model';
import { UserActions, UserActionTypes } from './user.actions';

export interface UserState {
  customer: Customer;
  authorized: boolean;
  error: HttpErrorResponse;
}

export const getCustomer = (state: UserState) => state.customer;
export const getAuthorized = (state: UserState) => state.authorized;
export const getError = (state: UserState) => state.error;

export const initialState: UserState = {
  customer: null,
  authorized: false,
  error: undefined,
};

export function userStateReducer(
  state = initialState,
  action: UserActions
): UserState {
  switch (action.type) {

    case UserActionTypes.LoginUser: {
      return initialState;
    }

    case UserActionTypes.LoginUserFail: {
      return {
        ...initialState,
        error: action.payload
      };
    }

    case UserActionTypes.LoginUserSuccess: {
      return {
        ...initialState,
        authorized: true,
        customer: action.payload
      };
    }

    case UserActionTypes.LogoutUser: {
      return initialState;
    }

    case UserActionTypes.CreateUserFail: {
      return {
        ...state,
        error: action.payload
      };
    }
  }

  return state;
}
