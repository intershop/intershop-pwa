import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Action } from '@ngrx/store';
import { AccountLogin } from '../../../core/services/account-login/account-login.model';
import { CustomerData } from '../../../models/customer/customer.interface';
import { Customer } from '../../../models/customer/customer.model';

export enum LoginActionTypes {
  LoginUser = '[Account] Login User',
  LoginUserSuccess = '[Account] Login User Success',
  LoginUserFail = '[Account] Login User Failed',
  LogoutUser = '[Account] Logout User',
  CreateUser = '[Account] Create User',
  CreateUserSuccess = '[Account] Create User Success',
  CreateUserFail = '[Account] Create User Failed',
}


export class LoginUser implements Action {
  readonly type = LoginActionTypes.LoginUser;
  constructor(public payload: AccountLogin) { }
}

export class LoginUserFail implements Action {
  readonly type = LoginActionTypes.LoginUserFail;
  constructor(public payload: HttpErrorResponse) { }
}

export class LoginUserSuccess implements Action {
  readonly type = LoginActionTypes.LoginUserSuccess;
  constructor(public payload: Customer) { }
}

export class LogoutUser implements Action {
  readonly type = LoginActionTypes.LogoutUser;
}

export class CreateUser implements Action {
  readonly type = LoginActionTypes.CreateUser;
  constructor(public payload: CustomerData) { }
}

export class CreateUserSuccess implements Action {
  readonly type = LoginActionTypes.CreateUserSuccess;
  constructor(public payload: Customer) { }
}

export class CreateUserFail implements Action {
  readonly type = LoginActionTypes.CreateUserFail;
  constructor(public payload: HttpErrorResponse) { }
}

export type LoginActions = LoginUser | LoginUserFail | LoginUserSuccess | LogoutUser | CreateUser | CreateUserFail | CreateUserSuccess;
