import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { UserRole } from 'ish-core/models/user-role/user-role.model';
import { User } from 'ish-core/models/user/user.model';

export enum UsersActionTypes {
  LoadUsers = '[Users] Load Users',
  LoadUsersFail = '[Users API] Load Users Fail',
  LoadUsersSuccess = '[Users API] Load Users Success',
  LoadUsersRoles = '[Users] Load Users Roles',
  LoadUserRoles = '[Users] Load User Roles',
  LoadUserRolesFail = '[Users] Load User Roles Fail',
  LoadUserRolesSuccess = '[Users] Load User Roles Success',
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

export class LoadUsersRoles implements Action {
  readonly type = UsersActionTypes.LoadUsersRoles;
  constructor(public payload: { users: User[] }) {}
}

export class LoadUserRoles implements Action {
  readonly type = UsersActionTypes.LoadUserRoles;
  constructor(public payload: { user: User }) {}
}

export class LoadUserRolesSuccess implements Action {
  readonly type = UsersActionTypes.LoadUserRolesSuccess;
  constructor(public payload: { user: User; userRoles: UserRole[] }) {}
}

export class LoadUserRolesFail implements Action {
  readonly type = UsersActionTypes.LoadUserRolesFail;
  constructor(public payload: { error: HttpError }) {}
}

export type UsersAction =
  | LoadUsers
  | LoadUsersFail
  | LoadUsersSuccess
  | LoadUsersRoles
  | LoadUserRoles
  | LoadUserRolesSuccess
  | LoadUserRolesFail;
