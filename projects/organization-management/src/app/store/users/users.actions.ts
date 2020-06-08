import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { UserBudgets } from 'ish-core/models/user-budgets/user-budgets.model';
import { User } from 'ish-core/models/user/user.model';

export enum UsersActionTypes {
  LoadUsers = '[Users] Load Users',
  LoadUsersFail = '[Users API] Load Users Fail',
  LoadUsersSuccess = '[Users API] Load Users Success',
  LoadUsersBudgets = '[Users] Load Users Budgets',
  LoadUserBudgets = '[Users] Load User Budgets',
  LoadUserBudgetsFail = '[Users] Load User Budgets Fail',
  LoadUserBudgetsSuccess = '[Users] Load User Budgets Success',
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

export class LoadUsersBudgets implements Action {
  readonly type = UsersActionTypes.LoadUsersBudgets;
  constructor(public payload: { users: User[] }) {}
}

export class LoadUserBudgets implements Action {
  readonly type = UsersActionTypes.LoadUserBudgets;
  constructor(public payload: { user: User }) {}
}

export class LoadUserBudgetsSuccess implements Action {
  readonly type = UsersActionTypes.LoadUserBudgetsSuccess;
  constructor(public payload: { user: User; userBudgets: UserBudgets }) {}
}

export class LoadUserBudgetsFail implements Action {
  readonly type = UsersActionTypes.LoadUserBudgetsFail;
  constructor(public payload: { error: HttpError }) {}
}

export type UsersAction =
  | LoadUsers
  | LoadUsersFail
  | LoadUsersSuccess
  | LoadUsersBudgets
  | LoadUserBudgets
  | LoadUserBudgetsSuccess
  | LoadUserBudgetsFail;
