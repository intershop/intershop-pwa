import { createAction, createActionGroup, emptyProps } from '@ngrx/store';

import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerLoginType, CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { UserCostCenter } from 'ish-core/models/user-cost-center/user-cost-center.model';
import { User } from 'ish-core/models/user/user.model';
import { MessagesPayloadType } from 'ish-core/store/core/messages';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loginUser = createAction('[User] Login User', payload<{ credentials: Credentials }>());

export const loginUserWithToken = createAction('[User] Login User With Token', payload<{ token: string }>());

export const loginUserFail = createAction('[User API] Login User Failed', httpError());

export const loginUserSuccess = createAction('[User API] Login User Success', payload<CustomerLoginType>());

export const loadCompanyUser = createAction('[User Internal] Load Company User');

export const loadCompanyUserFail = createAction('[User API] Load Company User Fail', httpError());

export const loadCompanyUserSuccess = createAction('[User API] Load Company User Success', payload<{ user: User }>());

export const logoutUser = createAction('[User] Logout User');

// TODO: this should be an API action
export const logoutUserSuccess = createAction('[User] Logout User Success');

export const logoutUserFail = createAction('[User API] Logout User Failed', httpError());

export const createUser = createAction('[User] Create User', payload<CustomerRegistrationType>());

export const createUserSuccess = createAction('[User API] Create User Success', payload<{ email: string }>());

export const createUserFail = createAction('[User API] Create User Failed', httpError());

export const createUserApprovalRequired = createAction(
  '[User Internal] Create User Approval Required',
  payload<{ email: string }>()
);

export const updateUser = createAction(
  '[User] Update User',
  payload<{ user: User; credentials?: Credentials; successMessage?: MessagesPayloadType }>()
);

export const updateUserSuccess = createAction(
  '[User API] Update User Succeeded',
  payload<{ user: User; successMessage?: MessagesPayloadType }>()
);

export const updateUserFail = createAction('[User API] Update User Failed', httpError());

export const updateUserPreferredPayment = createAction(
  '[User] Update User Preferred Payment',
  payload<{ user: User; paymentMethodId: string; successMessage?: MessagesPayloadType }>()
);

export const updateUserPassword = createAction(
  '[User] Update User Password',
  payload<{ password: string; currentPassword: string; successMessage?: MessagesPayloadType }>()
);

export const updateUserPasswordSuccess = createAction(
  '[User API] Update User Password Succeeded',
  payload<{ successMessage?: MessagesPayloadType }>()
);

export const updateUserPasswordFail = createAction('[User API] Update User Password Failed', httpError());

export const updateCustomer = createAction(
  '[User] Update Customer',
  payload<{ customer: Customer; successMessage?: MessagesPayloadType }>()
);

export const updateCustomerSuccess = createAction(
  '[User API] Update Customer Succeeded',
  payload<{ customer: Customer; successMessage?: MessagesPayloadType }>()
);

export const updateCustomerFail = createAction('[User API] Update Customer Failed', httpError());

export const setAdditionalRegistrationData = createAction(
  '[User Internal] Set Additional Registration Data',
  payload<{ customer: Customer; credentials: Credentials; isApprovalRequired: boolean; email: string }>()
);

export const postRegistrationProcessing = createAction(
  '[User Internal] Post Registration Processing',
  payload<{ isApprovalRequired: boolean; credentials: Credentials; email: string }>()
);

export const userErrorReset = createAction('[User Internal] Reset User Error');

export const loadUserByAPIToken = createAction('[User] Load User by API Token');

export const personalizationStatusDetermined = createAction('[User Internal] Personalization Status Determined');

export const loadUserCostCenters = createAction('[User] Load User Cost Centers');

export const loadUserCostCentersFail = createAction('[User API] Load User Cost Centers Fail', httpError());

export const loadUserCostCentersSuccess = createAction(
  '[User API] Load User Cost Centers Success',
  payload<{ costCenters: UserCostCenter[] }>()
);

export const loadUserPaymentMethods = createAction('[User] Load User Payment Methods');

export const loadUserPaymentMethodsFail = createAction('[User API] Load User Payment Methods Fail', httpError());

export const loadUserPaymentMethodsSuccess = createAction(
  '[User API] Load User Payment Methods Success',
  payload<{ paymentMethods: PaymentMethod[] }>()
);

export const deleteUserPaymentInstrument = createAction(
  '[User] Delete User Instrument Payment ',
  payload<{ id: string; successMessage?: MessagesPayloadType }>()
);

export const deleteUserPaymentInstrumentFail = createAction(
  '[User API] Delete User Payment Instrument Fail',
  httpError()
);

export const deleteUserPaymentInstrumentSuccess = createAction('[User API] Delete User Payment Instrument Success');

export const requestPasswordReminder = createAction(
  '[Password Reminder] Request Password Reminder',
  payload<{ data: PasswordReminder }>()
);

export const requestPasswordReminderSuccess = createAction('[Password Reminder API] Request Password Reminder Success');

export const requestPasswordReminderFail = createAction(
  '[Password Reminder API] Request Password Reminder Fail',
  httpError()
);

export const resetPasswordReminder = createAction('[Password Reminder] Reset Password Reminder Data');

export const updateUserPasswordByPasswordReminder = createAction(
  '[Password Reminder] Update User Password',
  payload<{ password: string; userID: string; secureCode: string }>()
);

export const updateUserPasswordByPasswordReminderSuccess = createAction(
  '[Password Reminder API] Update User Password Succeeded'
);

export const updateUserPasswordByPasswordReminderFail = createAction(
  '[Password Reminder API] Update User Password Failed',
  httpError()
);

export const fetchAnonymousUserToken = createAction('[Token API] Fetch Anonymous User Token');

export const userNewsletterActions = createActionGroup({
  source: 'User Newsletter',
  events: {
    'Load User Newsletter Subscription': emptyProps(),
    'Update User Newsletter Subscription': payload<{ subscriptionStatus: boolean; userEmail?: string }>(),
  },
});

export const userNewsletterApiActions = createActionGroup({
  source: 'User Newsletter API',
  events: {
    'Load User Newsletter Subscription Success': payload<{ subscribed: boolean }>(),
    'Load User Newsletter Subscription Fail': httpError<{}>(),
    'Update User Newsletter Subscription Success': payload<{ subscriptionStatus: boolean }>(),
    'Update User Newsletter Subscription Fail': httpError<{}>(),
  },
});
