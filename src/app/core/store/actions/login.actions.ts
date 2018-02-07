import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Action } from '@ngrx/store';
import { AccountLogin } from '../../../core/services/account-login/account-login.model';
import { CustomerData } from '../../../models/customer/customer.interface';
import { Customer } from '../../../models/customer/customer.model';

export const LOGIN_USER = '[Account] Login User';
export const LOGIN_USER_SUCCESS = '[Account] Login User Success';
export const LOGIN_USER_FAIL = '[Account] Login User Failed';
export const LOGOUT_USER = '[Account] Logout User';
export const CREATE_USER = '[Account] Create User';
export const CREATE_USER_SUCCESS = '[Account] Create User Success';
export const CREATE_USER_FAIL = '[Account] Create User Failed';

export class LoginUser implements Action {
  readonly type = LOGIN_USER;
  constructor(public payload: AccountLogin) { }
}

export class LoginUserFail implements Action {
  readonly type = LOGIN_USER_FAIL;
  constructor(public payload: HttpErrorResponse) { }
}

export class LoginUserSuccess implements Action {
  readonly type = LOGIN_USER_SUCCESS;
  constructor(public payload: Customer) { }
}

export class LogoutUser implements Action {
  readonly type = LOGOUT_USER;
}

export class CreateUser implements Action {
  readonly type = CREATE_USER;
  constructor(public payload: CustomerData) { }
}

export class CreateUserSuccess implements Action {
  readonly type = CREATE_USER_SUCCESS;
  constructor(public payload: Customer) { }
}

export class CreateUserFail implements Action {
  readonly type = CREATE_USER_FAIL;
  constructor(public payload: HttpErrorResponse) { }
}

export type LoginUserAction = LoginUser | LoginUserFail | LoginUserSuccess | LogoutUser | CreateUser | CreateUserFail | CreateUserSuccess;
