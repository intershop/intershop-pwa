import { Customer } from '../../../models/customer/customer.model';
import * as fromAccount from '../actions/login.actions';

export interface LoginState {
  entity: Customer;
  authorized: boolean;
  loggingIn: boolean;
}

export const initialState: LoginState = {
  entity: { id: 'value' } as Customer,
  authorized: false,
  loggingIn: false,
};

export function reducer(
  state = initialState,
  action: fromAccount.LoginUserAction
): LoginState {
  switch (action.type) {

    case fromAccount.LOGIN_USER: {
      return {
        ...state,
        loggingIn: true
      };
    }

    case fromAccount.LOGIN_USER_FAIL: {
      return {
        ...state,
        entity: null,
        authorized: false,
        loggingIn: false,
      };
    }

    case fromAccount.LOGIN_USER_SUCCESS: {
      const entity = action.payload;
      return {
        ...state,
        authorized: true,
        loggingIn: false,
        entity
      };
    }

  }

  return state;
}

export const getCustomer = (state: LoginState): Customer => state.entity;
export const getLoggingIn = (state: LoginState): boolean => state.loggingIn;
export const getAuthorized = (state: LoginState): boolean => state.authorized;
