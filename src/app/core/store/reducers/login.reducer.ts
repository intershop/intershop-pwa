import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../../../models/customer/customer.model';
import * as fromAccount from '../actions/login.actions';

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
  action: fromAccount.LoginUserAction
): LoginState {
  switch (action.type) {

    case fromAccount.LOGIN_USER: {
      return initialState;
    }

    case fromAccount.LOGIN_USER_FAIL: {
      return {
        ...initialState,
        error: action.payload
      };
    }

    case fromAccount.LOGIN_USER_SUCCESS: {
      const entity = action.payload;
      return {
        ...initialState,
        authorized: true,
        entity
      };
    }

    case fromAccount.LOGOUT_USER: {
      return initialState;
    }

    case fromAccount.CREATE_USER_FAIL: {
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
