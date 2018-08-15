import { BasketAction, BasketActionTypes } from '../../../checkout/store/basket';
import { Customer } from '../../../models/customer/customer.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Order } from '../../../models/order/order.model';
import { User } from '../../../models/user/user.model';
import { UserAction, UserActionTypes } from './user.actions';

export interface UserState {
  customer: Customer;
  user: User;
  recentOrder: Order;
  authorized: boolean;
  authToken: string;
  error: HttpError;
}

export const getCustomer = (state: UserState) => state.customer;
export const getUser = (state: UserState) => state.user;
export const getAuthorized = (state: UserState) => state.authorized;
export const getAuthToken = (state: UserState) => state.authToken;
export const getError = (state: UserState) => state.error;

export const initialState: UserState = {
  customer: undefined,
  user: undefined,
  recentOrder: undefined,
  authorized: false,
  authToken: undefined,
  error: undefined,
};

export function userReducer(state = initialState, action: UserAction | BasketAction): UserState {
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

    case UserActionTypes.SetAPIToken: {
      return {
        ...state,
        authToken: action.payload,
      };
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
        ...state,
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

    case BasketActionTypes.CreateOrderSuccess: {
      const payload = action.payload;

      return {
        ...state,
        recentOrder: payload,
      };
    }
  }

  return state;
}
