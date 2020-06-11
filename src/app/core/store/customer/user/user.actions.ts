import { createAction } from '@ngrx/store';

import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loginUser = createAction('[Account] Login User', payload<{ credentials: Credentials }>());

export const loginUserFail = createAction('[Account API] Login User Failed', httpError());

export const loginUserSuccess = createAction('[Account API] Login User Success', payload<CustomerUserType>());

export const setAPIToken = createAction('[Account Internal] Set API Token', payload<{ apiToken: string }>());

export const resetAPIToken = createAction('[Account Internal] Reset API Token');

export const loadCompanyUser = createAction('[Account Internal] Load Company User');

export const loadCompanyUserFail = createAction('[Account API] Load Company User Fail', httpError());

export const loadCompanyUserSuccess = createAction(
  '[Account API] Load Company User Success',
  payload<{ user: User }>()
);

export const logoutUser = createAction('[Account] Logout User');

export const createUser = createAction('[Account] Create User', payload<CustomerRegistrationType>());

export const createUserFail = createAction('[Account API] Create User Failed', httpError());

export const updateUser = createAction(
  '[Account] Update User',
  payload<{ user: User; successMessage?: string; successRouterLink?: string }>()
);

export const updateUserSuccess = createAction(
  '[Account API] Update User Succeeded',
  payload<{ user: User; successMessage?: string }>()
);

export const updateUserFail = createAction('[Account API] Update User Failed', httpError());

export const updateUserPassword = createAction(
  '[Account] Update User Password',
  payload<{ password: string; currentPassword: string; successMessage?: string }>()
);

export const updateUserPasswordSuccess = createAction(
  '[Account API] Update User Password Succeeded',
  payload<{ successMessage?: string }>()
);

export const updateUserPasswordFail = createAction('[Account API] Update User Password Failed', httpError());

export const updateCustomer = createAction(
  '[Account] Update Customer',
  payload<{ customer: Customer; successMessage?: string; successRouterLink?: string }>()
);

export const updateCustomerSuccess = createAction(
  '[Account API] Update Customer Succeeded',
  payload<{ customer: Customer; successMessage?: string }>()
);

export const updateCustomerFail = createAction('[Account API] Update Customer Failed', httpError());

export const userErrorReset = createAction('[Account Internal] Reset User Error');

export const loadUserByAPIToken = createAction('[Account] Load User by API Token', payload<{ apiToken: string }>());

export const setPGID = createAction('[Personalization Internal] Set PGID', payload<{ pgid: string }>());

export const loadUserPaymentMethods = createAction('[Account] Load User Payment Methods');

export const loadUserPaymentMethodsFail = createAction('[Account API] Load User Payment Methods Fail', httpError());

export const loadUserPaymentMethodsSuccess = createAction(
  '[Account API] Load User Payment Methods Success',
  payload<{ paymentMethods: PaymentMethod[] }>()
);

export const deleteUserPaymentInstrument = createAction(
  '[Account] Delete User Instrument Payment ',
  payload<{ id: string }>()
);

export const deleteUserPaymentInstrumentFail = createAction(
  '[Account API] Delete User Payment Instrument Fail',
  httpError()
);

export const deleteUserPaymentInstrumentSuccess = createAction('[Account API] Delete User Payment Instrument Success');

export const requestPasswordReminder = createAction(
  '[Password Reminder] Request Password Reminder',
  payload<{ data: PasswordReminder }>()
);

export const requestPasswordReminderSuccess = createAction('[Password Reminder API] Request Password Reminder Success');

export const requestPasswordReminderFail = createAction(
  '[Password Reminder API] Request Password Reminder Fail',
  httpError()
);

export const resetPasswordReminder = createAction('[Password Reminder Internal] Reset Password Reminder Data');

export const updateUserPasswordByPasswordReminder = createAction(
  '[Password Reminder] Update User Password',
  payload<{ password: string; userID: string; secureCode: string }>()
);

export const updateUserPasswordByPasswordReminderSuccess = createAction(
  '[Password Reminder] Update User Password Succeeded'
);

export const updateUserPasswordByPasswordReminderFail = createAction(
  '[Password Reminder] Update User Password Failed',
  httpError()
);
