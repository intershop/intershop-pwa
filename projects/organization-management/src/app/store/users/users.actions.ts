import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

export enum UsersActionTypes {
  LoadUsers = '[Users] Load Users',
  LoadUsersFail = '[Users API] Load Users Fail',
  LoadUsersSuccess = '[Users API] Load Users Success',
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

export type UsersAction = LoadUsers | LoadUsersFail | LoadUsersSuccess;
