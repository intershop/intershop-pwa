import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Action } from '@ngrx/store';
import { AccountLogin } from '../../../core/services/account-login/account-login.model';
import { CustomerData } from '../../../models/customer/customer.interface';
import { Customer } from '../../../models/customer/customer.model';

export enum UserActionTypes {
  LoginUser = '[Account] Login User',
  LoginUserSuccess = '[Account] Login User Success',
  LoginUserFail = '[Account] Login User Failed',
  LogoutUser = '[Account] Logout User',
  CreateUser = '[Account] Create User',
  CreateUserSuccess = '[Account] Create User Success',
  CreateUserFail = '[Account] Create User Failed',
}


export class LoginUser implements Action {
  readonly type = UserActionTypes.LoginUser;
  constructor(public payload: AccountLogin) { }
}

export class LoginUserFail implements Action {
  readonly type = UserActionTypes.LoginUserFail;
  constructor(public payload: HttpErrorResponse) { }
}

export class LoginUserSuccess implements Action {
  readonly type = UserActionTypes.LoginUserSuccess;
  constructor(public payload: Customer) { }
}

export class LogoutUser implements Action {
  readonly type = UserActionTypes.LogoutUser;
}

export class CreateUser implements Action {
  readonly type = UserActionTypes.CreateUser;
  constructor(public payload: CustomerData) { }
}

export class CreateUserSuccess implements Action {
  readonly type = UserActionTypes.CreateUserSuccess;
  constructor(public payload: Customer) { }
}

export class CreateUserFail implements Action {
  readonly type = UserActionTypes.CreateUserFail;
  constructor(public payload: HttpErrorResponse) { }
}

export type UserAction = LoginUser | LoginUserFail | LoginUserSuccess | LogoutUser | CreateUser | CreateUserFail | CreateUserSuccess;
