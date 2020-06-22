import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

export enum UsersActionTypes {
  LoadUsers = '[Users] Load Users',
  LoadUsersFail = '[Users API] Load Users Fail',
  LoadUsersSuccess = '[Users API] Load Users Success',
  LoadUserFail = '[Users API] Load User Fail',
  LoadUserSuccess = '[Users API] Load User Success',
  ResetUsers = '[Users] Reset Users',
}

export class LoadUsers implements Action {
  readonly type = UsersActionTypes.LoadUsers;
}

export class LoadUsersFail implements Action {
  readonly type = UsersActionTypes.LoadUsersFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadUsersSuccess implements Action {
  readonly type = UsersActionTypes.LoadUsersSuccess;
  constructor(public payload: { users: User[] }) {}
}

export class LoadUserFail implements Action {
  readonly type = UsersActionTypes.LoadUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadUserSuccess implements Action {
  readonly type = UsersActionTypes.LoadUserSuccess;
  constructor(public payload: { user: User }) {}
}

export class ResetUsers implements Action {
  readonly type = UsersActionTypes.ResetUsers;
}

export type UsersAction = LoadUsers | LoadUsersFail | LoadUsersSuccess | LoadUserFail | LoadUserSuccess | ResetUsers;
