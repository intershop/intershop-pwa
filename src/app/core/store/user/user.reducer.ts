import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';

import { UserAction, UserActionTypes } from './user.actions';

export interface UserState {
  customer: Customer;
  user: User;
  authorized: boolean;
  _authToken: string;
  _lastAuthTokenBeforeLogin: string;
  paymentMethods: PaymentMethod[];
  loading: boolean;
  successMessage: string;
  error: HttpError;
  pgid: string;
  passwordReminderSuccess: boolean;
  passwordReminderError: HttpError;
}

export const initialState: UserState = {
  customer: undefined,
  user: undefined,
  authorized: false,
  _authToken: undefined,
  _lastAuthTokenBeforeLogin: undefined,
  paymentMethods: undefined,
  loading: false,
  successMessage: undefined, // ToDo: check this implementation if toasts are available
  error: undefined,
  pgid: undefined,
  passwordReminderSuccess: undefined,
  passwordReminderError: undefined,
};

export function userReducer(state = initialState, action: UserAction): UserState {
  switch (action.type) {
    case UserActionTypes.UserSuccessMessageReset: {
      return {
        ...state,
        successMessage: undefined,
      };
    }

    case UserActionTypes.UserErrorReset: {
      return {
        ...state,
        error: undefined,
      };
    }

    case UserActionTypes.LoginUser: {
      return {
        ...initialState,
        _authToken: state._authToken,
        _lastAuthTokenBeforeLogin: state._authToken,
      };
    }
    case UserActionTypes.LogoutUser: {
      return initialState;
    }

    case UserActionTypes.SetAPIToken: {
      return {
        ...state,
        _authToken: action.payload.apiToken,
      };
    }

    case UserActionTypes.ResetAPIToken: {
      return {
        ...state,
        _authToken: undefined,
      };
    }

    case UserActionTypes.LoadCompanyUser:
    case UserActionTypes.CreateUser:
    case UserActionTypes.UpdateUser:
    case UserActionTypes.UpdateUserPassword:
    case UserActionTypes.UpdateCustomer:
    case UserActionTypes.LoadUserPaymentMethods:
    case UserActionTypes.DeleteUserPayment: {
      return {
        ...state,
        loading: true,
        successMessage: undefined,
      };
    }

    case UserActionTypes.LoginUserFail:
    case UserActionTypes.LoadCompanyUserFail:
    case UserActionTypes.CreateUserFail: {
      const error = action.payload.error;

      return {
        ...initialState,
        loading: false,
        error,
        _authToken: state._authToken,
      };
    }

    case UserActionTypes.UpdateUserFail:
    case UserActionTypes.UpdateUserPasswordFail:
    case UserActionTypes.UpdateCustomerFail:
    case UserActionTypes.LoadUserPaymentMethodsFail:
    case UserActionTypes.DeleteUserPaymentFail: {
      const error = action.payload.error;

      return {
        ...state,
        loading: false,
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
        loading: false,
        error: undefined,
      };
    }

    case UserActionTypes.LoadCompanyUserSuccess: {
      const user = action.payload.user;

      return {
        ...state,
        user,
        loading: false,
        error: undefined,
      };
    }

    case UserActionTypes.UpdateUserSuccess: {
      const user = action.payload.user;
      const successMessage = action.payload.successMessage;

      return {
        ...state,
        user,
        loading: false,
        error: undefined,
        successMessage,
      };
    }

    case UserActionTypes.UpdateUserPasswordSuccess: {
      const successMessage = action.payload.successMessage;

      return {
        ...state,
        loading: false,
        error: undefined,
        successMessage,
      };
    }

    case UserActionTypes.UpdateCustomerSuccess: {
      const customer = action.payload.customer;
      const successMessage = action.payload.successMessage;

      return {
        ...state,
        customer,
        loading: false,
        error: undefined,
        successMessage,
      };
    }

    case UserActionTypes.SetPGID: {
      return {
        ...state,
        pgid: action.payload.pgid,
      };
    }

    case UserActionTypes.LoadUserPaymentMethodsSuccess: {
      return {
        ...state,
        paymentMethods: action.payload.paymentMethods,
        loading: false,
        error: undefined,
      };
    }

    case UserActionTypes.DeleteUserPaymentSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
      };
    }

    case UserActionTypes.UpdateUserPasswordByPasswordReminder:
    case UserActionTypes.RequestPasswordReminder: {
      return {
        ...state,
        loading: true,
        passwordReminderSuccess: undefined,
        passwordReminderError: undefined,
      };
    }

    case UserActionTypes.UpdateUserPasswordByPasswordReminderSuccess:
    case UserActionTypes.RequestPasswordReminderSuccess: {
      return {
        ...state,
        loading: false,
        passwordReminderSuccess: true,
        passwordReminderError: undefined,
      };
    }

    case UserActionTypes.UpdateUserPasswordByPasswordReminderFail:
    case UserActionTypes.RequestPasswordReminderFail: {
      return {
        ...state,
        loading: false,
        passwordReminderSuccess: false,
        passwordReminderError: action.payload.error,
      };
    }

    case UserActionTypes.ResetPasswordReminder: {
      return {
        ...state,
        passwordReminderSuccess: undefined,
        passwordReminderError: undefined,
      };
    }
  }

  return state;
}
