import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../../../models/customer/customer.model';
import { LoginActions, LoginActionTypes } from '../actions/login.actions';

export interface LoginState {
  entity: Customer;
  authorized: boolean;
  error: HttpErrorResponse;
}

export const initialState: LoginState = {
  entity: null,
  authorized: false,
  error: undefined,
};

export function reducer(
  state = initialState,
  action: LoginActions
): LoginState {
  switch (action.type) {

    case LoginActionTypes.LoginUser: {
      return initialState;
    }

    case LoginActionTypes.LoginUserFail: {
      return {
        ...initialState,
        error: action.payload
      };
    }

    case LoginActionTypes.LoginUserSuccess: {
      return {
        ...initialState,
        authorized: true,
        entity: action.payload
      };
    }

    case LoginActionTypes.LogoutUser: {
      return initialState;
    }

    case LoginActionTypes.CreateUserFail: {
      return {
        ...state,
        error: action.payload
      };
    }
  }

  return state;
}

export const getCustomer = (state: LoginState) => state.entity;
export const getAuthorized = (state: LoginState) => state.authorized;
export const getError = (state: LoginState) => state.error;
