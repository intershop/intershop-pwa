import { Customer } from '../../../models/customer/customer.model';
import * as fromAccount from '../actions/login.actions';

export interface LoginState {
  entity: Customer;
  authorized: boolean;
  loggingIn: boolean;
  loginError: string;
}

export const initialState: LoginState = {
  entity: null,
  authorized: false,
  loggingIn: false,
  loginError: undefined,
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
        loginError: action.payload
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
  }

  return state;
}

export const getCustomer = (state: LoginState): Customer => state.entity;
export const getLoggingIn = (state: LoginState): boolean => state.loggingIn;
export const getAuthorized = (state: LoginState): boolean => state.authorized;
