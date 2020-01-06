import { Action } from '@ngrx/store';

import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';

export enum UserActionTypes {
  LoginUser = '[Account] Login User',
  LoginUserSuccess = '[Account API] Login User Success',
  LoginUserFail = '[Account API] Login User Failed',
  SetAPIToken = '[Account Internal] Set API Token',
  ResetAPIToken = '[Account Internal] Reset API Token',
  LoadCompanyUser = '[Account Internal] Load Company User',
  LoadCompanyUserFail = '[Account API] Load Company User Fail',
  LoadCompanyUserSuccess = '[Account API] Load Company User Success',
  LogoutUser = '[Account] Logout User',
  CreateUser = '[Account] Create User',
  CreateUserFail = '[Account API] Create User Failed',
  UpdateUser = '[Account] Update User',
  UpdateUserSuccess = '[Account API] Update User Succeeded',
  UpdateUserFail = '[Account API] Update User Failed',
  UpdateUserPassword = '[Account] Update User Password',
  UpdateUserPasswordSuccess = '[Account API] Update User Password Succeeded',
  UpdateUserPasswordFail = '[Account API] Update User Password Failed',
  UpdateCustomer = '[Account] Update Customer',
  UpdateCustomerSuccess = '[Account API] Update Customer Succeeded',
  UpdateCustomerFail = '[Account API] Update Customer Failed',
  UserSuccessMessageReset = '[Account Internal] Reset Update Success Message',
  UserErrorReset = '[Account Internal] Reset User Error',
  LoadUserByAPIToken = '[Account] Load User by API Token',
  SetPGID = '[Personalization Internal] Set PGID',
  LoadUserPaymentMethods = '[Account] Load User Payment Methods',
  LoadUserPaymentMethodsFail = '[Account API] Load User Payment Methods Fail',
  LoadUserPaymentMethodsSuccess = '[Account API] Load User Payment Methods Success',
  DeleteUserPayment = '[Account] Delete User Payment ',
  DeleteUserPaymentFail = '[Account API] Delete User Payment Fail',
  DeleteUserPaymentSuccess = '[Account API] Delete User Payment Success',
  RequestPasswordReminder = '[Password Reminder] Request Password Reminder',
  RequestPasswordReminderFail = '[Password Reminder API] Request Password Reminder Fail',
  RequestPasswordReminderSuccess = '[Password Reminder API] Request Password Reminder Success',
  ResetPasswordReminder = '[Password Reminder Internal] Reset Password Reminder Data',
  UpdateUserPasswordByPasswordReminder = '[Password Reminder] Update User Password',
  UpdateUserPasswordByPasswordReminderSuccess = '[Password Reminder] Update User Password Succeeded',
  UpdateUserPasswordByPasswordReminderFail = '[Password Reminder] Update User Password Failed',
}

export class LoginUser implements Action {
  readonly type = UserActionTypes.LoginUser;
  constructor(public payload: { credentials: LoginCredentials }) {}
}

export class LoginUserFail implements Action {
  readonly type = UserActionTypes.LoginUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoginUserSuccess implements Action {
  readonly type = UserActionTypes.LoginUserSuccess;
  constructor(public payload: CustomerUserType) {}
}

export class SetAPIToken implements Action {
  readonly type = UserActionTypes.SetAPIToken;
  constructor(public payload: { apiToken: string }) {}
}

export class ResetAPIToken implements Action {
  readonly type = UserActionTypes.ResetAPIToken;
}

export class LoadCompanyUser implements Action {
  readonly type = UserActionTypes.LoadCompanyUser;
}

export class LoadCompanyUserFail implements Action {
  readonly type = UserActionTypes.LoadCompanyUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadCompanyUserSuccess implements Action {
  readonly type = UserActionTypes.LoadCompanyUserSuccess;
  constructor(public payload: { user: User }) {}
}

export class LogoutUser implements Action {
  readonly type = UserActionTypes.LogoutUser;
}

export class CreateUser implements Action {
  readonly type = UserActionTypes.CreateUser;
  constructor(public payload: CustomerRegistrationType) {}
}

export class CreateUserFail implements Action {
  readonly type = UserActionTypes.CreateUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateUser implements Action {
  readonly type = UserActionTypes.UpdateUser;
  constructor(public payload: { user: User; successMessage?: string }) {}
}

export class UpdateUserSuccess implements Action {
  readonly type = UserActionTypes.UpdateUserSuccess;
  constructor(public payload: { user: User; successMessage?: string }) {}
}

export class UpdateUserFail implements Action {
  readonly type = UserActionTypes.UpdateUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateUserPassword implements Action {
  readonly type = UserActionTypes.UpdateUserPassword;
  constructor(public payload: { password: string; currentPassword: string; successMessage?: string }) {}
}

export class UpdateUserPasswordSuccess implements Action {
  readonly type = UserActionTypes.UpdateUserPasswordSuccess;
  constructor(public payload: { successMessage?: string }) {}
}

export class UpdateUserPasswordFail implements Action {
  readonly type = UserActionTypes.UpdateUserPasswordFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateCustomer implements Action {
  readonly type = UserActionTypes.UpdateCustomer;
  constructor(public payload: { customer: Customer; successMessage?: string }) {}
}

export class UpdateCustomerSuccess implements Action {
  readonly type = UserActionTypes.UpdateCustomerSuccess;
  constructor(public payload: { customer: Customer; successMessage?: string }) {}
}

export class UpdateCustomerFail implements Action {
  readonly type = UserActionTypes.UpdateCustomerFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UserSuccessMessageReset implements Action {
  readonly type = UserActionTypes.UserSuccessMessageReset;
}

export class UserErrorReset implements Action {
  readonly type = UserActionTypes.UserErrorReset;
}

export class LoadUserByAPIToken implements Action {
  readonly type = UserActionTypes.LoadUserByAPIToken;
  constructor(public payload: { apiToken: string }) {}
}

export class SetPGID implements Action {
  readonly type = UserActionTypes.SetPGID;
  constructor(public payload: { pgid: string }) {}
}

export class LoadUserPaymentMethods implements Action {
  readonly type = UserActionTypes.LoadUserPaymentMethods;
}

export class LoadUserPaymentMethodsFail implements Action {
  readonly type = UserActionTypes.LoadUserPaymentMethodsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadUserPaymentMethodsSuccess implements Action {
  readonly type = UserActionTypes.LoadUserPaymentMethodsSuccess;
  constructor(public payload: { paymentMethods: PaymentMethod[] }) {}
}

export class DeleteUserPayment implements Action {
  readonly type = UserActionTypes.DeleteUserPayment;
  constructor(public payload: { id: string }) {}
}

export class DeleteUserPaymentFail implements Action {
  readonly type = UserActionTypes.DeleteUserPaymentFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteUserPaymentSuccess implements Action {
  readonly type = UserActionTypes.DeleteUserPaymentSuccess;
}

export class RequestPasswordReminder implements Action {
  readonly type = UserActionTypes.RequestPasswordReminder;
  constructor(public payload: { data: PasswordReminder }) {}
}

export class RequestPasswordReminderSuccess implements Action {
  readonly type = UserActionTypes.RequestPasswordReminderSuccess;
}

export class RequestPasswordReminderFail implements Action {
  readonly type = UserActionTypes.RequestPasswordReminderFail;
  constructor(public payload: { error: HttpError }) {}
}

export class ResetPasswordReminder implements Action {
  readonly type = UserActionTypes.ResetPasswordReminder;
}

export class UpdateUserPasswordByPasswordReminder implements Action {
  readonly type = UserActionTypes.UpdateUserPasswordByPasswordReminder;
  constructor(public payload: { password: string; userID: string; secureCode: string }) {}
}

export class UpdateUserPasswordByPasswordReminderSuccess implements Action {
  readonly type = UserActionTypes.UpdateUserPasswordByPasswordReminderSuccess;
}

export class UpdateUserPasswordByPasswordReminderFail implements Action {
  readonly type = UserActionTypes.UpdateUserPasswordByPasswordReminderFail;
  constructor(public payload: { error: HttpError }) {}
}
export type UserAction =
  | LoginUser
  | LoginUserFail
  | LoginUserSuccess
  | SetAPIToken
  | ResetAPIToken
  | LoadCompanyUser
  | LoadCompanyUserFail
  | LoadCompanyUserSuccess
  | LogoutUser
  | CreateUser
  | CreateUserFail
  | UpdateUser
  | UpdateUserSuccess
  | UpdateUserFail
  | UpdateUserPassword
  | UpdateUserPasswordSuccess
  | UpdateUserPasswordFail
  | UpdateCustomer
  | UpdateCustomerSuccess
  | UpdateCustomerFail
  | UserSuccessMessageReset
  | UserErrorReset
  | LoadUserByAPIToken
  | SetPGID
  | LoadUserPaymentMethods
  | LoadUserPaymentMethodsFail
  | LoadUserPaymentMethodsSuccess
  | DeleteUserPayment
  | DeleteUserPaymentFail
  | DeleteUserPaymentSuccess
  | RequestPasswordReminder
  | RequestPasswordReminderSuccess
  | RequestPasswordReminderFail
  | ResetPasswordReminder
  | UpdateUserPasswordByPasswordReminder
  | UpdateUserPasswordByPasswordReminderSuccess
  | UpdateUserPasswordByPasswordReminderFail;
