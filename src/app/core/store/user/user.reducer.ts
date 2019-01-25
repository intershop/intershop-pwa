import { Customer } from '../../models/customer/customer.model';
import { HttpError } from '../../models/http-error/http-error.model';
import { User } from '../../models/user/user.model';

import { UserAction, UserActionTypes } from './user.actions';

export interface UserState {
  customer: Customer;
  user: User;
  authorized: boolean;
  _authToken: string;
  error: HttpError;
}

export const initialState: UserState = {
  customer: undefined,
  user: undefined,
  authorized: false,
  _authToken: undefined,
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
    case UserActionTypes.LogoutUser: {
      return initialState;
    }

    case UserActionTypes.CreateUserFail: {
      return { ...initialState, error: action.payload.error };
    }

    case UserActionTypes.SetAPIToken: {
      return {
        ...state,
        _authToken: action.payload.apiToken,
      };
    }

    case UserActionTypes.LoginUserFail:
    case UserActionTypes.LoadCompanyUserFail: {
      const error = action.payload.error;

      return {
        ...initialState,
        error,
      };
    }

    case UserActionTypes.LoginUserSuccess: {
      const customer = action.payload.customer;
      const user = action.payload.user;

      return {
        ...state,
        authorized: true,
        customer,
        user,
      };
    }

    case UserActionTypes.LoadCompanyUserSuccess: {
      const user = action.payload.user;

      return {
        ...state,
        user,
      };
    }
  }

  return state;
}
