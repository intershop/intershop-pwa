import { createReducer, on } from '@ngrx/store';

import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { UserCostCenter } from 'ish-core/models/user-cost-center/user-cost-center.model';
import { User } from 'ish-core/models/user/user.model';
import { loadRolesAndPermissionsFail } from 'ish-core/store/customer/authorization';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  createUser,
  createUserApprovalRequired,
  createUserFail,
  createUserSuccess,
  deleteUserPaymentInstrument,
  deleteUserPaymentInstrumentFail,
  deleteUserPaymentInstrumentSuccess,
  loadCompanyUser,
  loadCompanyUserFail,
  loadCompanyUserSuccess,
  loadUserByAPIToken,
  loadUserCostCenters,
  loadUserCostCentersFail,
  loadUserCostCentersSuccess,
  loadUserPaymentMethods,
  loadUserPaymentMethodsFail,
  loadUserPaymentMethodsSuccess,
  loginUserFail,
  loginUserSuccess,
  logoutUser,
  logoutUserFail,
  logoutUserSuccess,
  requestPasswordReminder,
  requestPasswordReminderFail,
  requestPasswordReminderSuccess,
  resetPasswordReminder,
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
  costCenters: UserCostCenter[];
  authorized: boolean;
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: HttpError;
  pgid: string;
  passwordReminderSuccess: boolean;
  passwordReminderError: HttpError;
  customerApprovalEmail: string;
}

const initialState: UserState = {
  customer: undefined,
  user: undefined,
  costCenters: undefined,
  authorized: false,
  paymentMethods: undefined,
  loading: false,
  error: undefined,
  pgid: undefined,
  passwordReminderSuccess: undefined,
  passwordReminderError: undefined,
  customerApprovalEmail: undefined,
};

export const userReducer = createReducer(
  initialState,
  on(
    userErrorReset,
    (state): UserState => ({
      ...state,
      error: undefined,
    })
  ),
  setLoadingOn(
    loadCompanyUser,
    loadUserByAPIToken,
    loadUserCostCenters,
    createUser,
    updateUser,
    updateUserPassword,
    updateCustomer,
    loadUserPaymentMethods,
    deleteUserPaymentInstrument,
    updateUserPasswordByPasswordReminder,
    requestPasswordReminder,
    logoutUser
  ),
  unsetLoadingOn(
    loadUserCostCentersFail,
    updateUserPasswordByPasswordReminderSuccess,
    requestPasswordReminderSuccess,
    updateUserPasswordByPasswordReminderFail,
    requestPasswordReminderFail
  ),
  unsetLoadingAndErrorOn(
    loginUserSuccess,
    loadCompanyUserSuccess,
    createUserSuccess,
    updateUserSuccess,
    updateUserPasswordSuccess,
    updateCustomerSuccess,
    loadUserCostCentersSuccess,
    loadUserPaymentMethodsSuccess,
    deleteUserPaymentInstrumentSuccess,
    logoutUserSuccess
  ),
  setErrorOn(
    updateUserFail,
    updateUserPasswordFail,
    updateCustomerFail,
    loadUserPaymentMethodsFail,
    deleteUserPaymentInstrumentFail,
    loadRolesAndPermissionsFail,
    logoutUserFail
  ),
  on(loginUserFail, loadCompanyUserFail, createUserFail, (_, action): UserState => {
    const error = action.payload.error;

    return {
      ...initialState,
      loading: false,
      error,
    };
  }),
  on(
    createUserApprovalRequired,
    (state, action): UserState => ({
      ...state,
      customerApprovalEmail: action.payload.email,
    })
  ),
  on(loginUserSuccess, (state: UserState, action): UserState => {
    const customer = action.payload.customer;
    const user = action.payload.user;
    const pgid = action.payload.pgid;

    return {
      ...state,
      authorized: true,
      customer,
      user,
      pgid,
      loading: false,
      error: undefined,
    };
  }),
  on(loadCompanyUserSuccess, (state, action): UserState => {
    const user = action.payload.user;

    return {
      ...state,
      user,
    };
  }),
  on(updateUserSuccess, (state, action): UserState => {
    const user = action.payload.user;

    return {
      ...state,
      user,
    };
  }),
  on(
    updateUserPasswordSuccess,
    (state): UserState => ({
      ...state,
    })
  ),
  on(updateCustomerSuccess, (state, action): UserState => {
    const customer = action.payload.customer;

    return {
      ...state,
      customer,
    };
  }),
  on(
    loadUserCostCentersSuccess,
    (state, action): UserState => ({
      ...state,
      costCenters: action.payload.costCenters,
    })
  ),
  on(
    loadUserPaymentMethodsSuccess,
    (state, action): UserState => ({
      ...state,
      paymentMethods: action.payload.paymentMethods,
    })
  ),
  on(
    deleteUserPaymentInstrumentSuccess,
    (state): UserState => ({
      ...state,
    })
  ),
  on(
    updateUserPasswordByPasswordReminder,
    requestPasswordReminder,
    (state): UserState => ({
      ...state,
      passwordReminderSuccess: undefined,
      passwordReminderError: undefined,
    })
  ),
  on(
    updateUserPasswordByPasswordReminderSuccess,
    requestPasswordReminderSuccess,
    (state): UserState => ({
      ...state,
      passwordReminderSuccess: true,
      passwordReminderError: undefined,
    })
  ),
  on(
    updateUserPasswordByPasswordReminderFail,
    requestPasswordReminderFail,
    (state, action): UserState => ({
      ...state,
      passwordReminderSuccess: false,
      passwordReminderError: action.payload.error,
    })
  ),
  on(
    resetPasswordReminder,
    (state): UserState => ({
      ...state,
      passwordReminderSuccess: undefined,
      passwordReminderError: undefined,
    })
  )
);
