import { createReducer, on } from '@ngrx/store';

import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';
import { loadRolesAndPermissionsFail } from 'ish-core/store/customer/authorization';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  createUser,
  createUserFail,
  deleteUserPaymentInstrument,
  deleteUserPaymentInstrumentFail,
  deleteUserPaymentInstrumentSuccess,
  loadCompanyUser,
  loadCompanyUserFail,
  loadCompanyUserSuccess,
  loadUserByAPIToken,
  loadUserPaymentMethods,
  loadUserPaymentMethodsFail,
  loadUserPaymentMethodsSuccess,
  loginUserFail,
  loginUserSuccess,
  requestPasswordReminder,
  requestPasswordReminderFail,
  requestPasswordReminderSuccess,
  resetPasswordReminder,
  setPGID,
  updateCustomer,
  updateCustomerFail,
  updateCustomerSuccess,
  updateUser,
  updateUserFail,
  updateUserPassword,
  updateUserPasswordByPasswordReminder,
  updateUserPasswordByPasswordReminderFail,
  updateUserPasswordByPasswordReminderSuccess,
  updateUserPasswordFail,
  updateUserPasswordSuccess,
  updateUserSuccess,
  userErrorReset,
} from './user.actions';

export interface UserState {
  customer: Customer;
  user: User;
  authorized: boolean;
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: HttpError;
  pgid: string;
  passwordReminderSuccess: boolean;
  passwordReminderError: HttpError;
}

export const initialState: UserState = {
  customer: undefined,
  user: undefined,
  authorized: false,
  paymentMethods: undefined,
  loading: false,
  error: undefined,
  pgid: undefined,
  passwordReminderSuccess: undefined,
  passwordReminderError: undefined,
};

export const userReducer = createReducer(
  initialState,
  on(userErrorReset, state => ({
    ...state,
    error: undefined,
  })),
  setLoadingOn(
    loadCompanyUser,
    loadUserByAPIToken,
    createUser,
    updateUser,
    updateUserPassword,
    updateCustomer,
    loadUserPaymentMethods,
    deleteUserPaymentInstrument,
    updateUserPasswordByPasswordReminder,
    requestPasswordReminder
  ),
  unsetLoadingOn(
    updateUserPasswordByPasswordReminderSuccess,
    requestPasswordReminderSuccess,
    updateUserPasswordByPasswordReminderFail,
    requestPasswordReminderFail
  ),
  setErrorOn(
    updateUserFail,
    updateUserPasswordFail,
    updateCustomerFail,
    loadUserPaymentMethodsFail,
    deleteUserPaymentInstrumentFail,
    loadRolesAndPermissionsFail
  ),
  on(loginUserFail, loadCompanyUserFail, createUserFail, (_, action) => {
    const error = action.payload.error;

    return {
      ...initialState,
      loading: false,
      error,
    };
  }),
  unsetLoadingAndErrorOn(
    loginUserSuccess,
    loadCompanyUserSuccess,
    updateUserSuccess,
    updateUserPasswordSuccess,
    updateCustomerSuccess,
    loadUserPaymentMethodsSuccess,
    deleteUserPaymentInstrumentSuccess
  ),
  on(loginUserSuccess, (state: UserState, action) => {
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
  }),
  on(loadCompanyUserSuccess, (state, action) => {
    const user = action.payload.user;

    return {
      ...state,
      user,
    };
  }),
  on(updateUserSuccess, (state, action) => {
    const user = action.payload.user;

    return {
      ...state,
      user,
    };
  }),
  on(updateUserPasswordSuccess, state => ({
    ...state,
  })),
  on(updateCustomerSuccess, (state, action) => {
    const customer = action.payload.customer;

    return {
      ...state,
      customer,
    };
  }),
  on(setPGID, (state, action) => ({
    ...state,
    pgid: action.payload.pgid,
  })),
  on(loadUserPaymentMethodsSuccess, (state, action) => ({
    ...state,
    paymentMethods: action.payload.paymentMethods,
  })),
  on(deleteUserPaymentInstrumentSuccess, state => ({
    ...state,
  })),
  on(updateUserPasswordByPasswordReminder, requestPasswordReminder, state => ({
    ...state,
    passwordReminderSuccess: undefined,
    passwordReminderError: undefined,
  })),
  on(updateUserPasswordByPasswordReminderSuccess, requestPasswordReminderSuccess, state => ({
    ...state,
    passwordReminderSuccess: true,
    passwordReminderError: undefined,
  })),
  on(updateUserPasswordByPasswordReminderFail, requestPasswordReminderFail, (state, action) => ({
    ...state,
    passwordReminderSuccess: false,
    passwordReminderError: action.payload.error,
  })),
  on(resetPasswordReminder, state => ({
    ...state,
    passwordReminderSuccess: undefined,
    passwordReminderError: undefined,
  }))
);
