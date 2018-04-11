import { HttpErrorResponse } from '@angular/common/http';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { Customer } from '../../../models/customer/customer.model';
import { CreateUserFail, LoginUserFail, LoginUserSuccess, UserActionTypes } from './user.actions';

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

export function userReducer(state = initialState, action: Action): UserState {
  switch (action.type) {
    case ROUTER_NAVIGATION: {
      return {
        ...state,
        error: undefined,
      };
    }

    case UserActionTypes.LoginUser: {
      return initialState;
    }

    case UserActionTypes.LoginUserFail: {
      return {
        ...initialState,
        error: (action as LoginUserFail).payload,
      };
    }

    case UserActionTypes.LoginUserSuccess: {
      return {
        ...initialState,
        authorized: true,
        customer: (action as LoginUserSuccess).payload,
      };
    }

    case UserActionTypes.LogoutUser: {
      return initialState;
    }

    case UserActionTypes.CreateUserFail: {
      return {
        ...state,
        error: (action as CreateUserFail).payload,
      };
    }
  }

  return state;
}
