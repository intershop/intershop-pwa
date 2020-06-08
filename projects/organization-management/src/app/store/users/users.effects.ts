import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { exhaustMap, map, mergeMap } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { UsersService } from '../../services/users/users.service';

import * as actions from './users.actions';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersService: UsersService) {}

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType<actions.LoadUsers>(actions.UsersActionTypes.LoadUsers),
    exhaustMap(() =>
      this.usersService
        .getUsers()
        .pipe(map(users => new actions.LoadUsersSuccess({ users }), mapErrorToAction(actions.LoadUsersFail)))
    )
  );

  @Effect()
  extendUsersBudgets$ = this.actions$.pipe(
    ofType<actions.LoadUsersSuccess>(actions.UsersActionTypes.LoadUsersSuccess),
    mapToPayloadProperty('users'),
    map(users => new actions.LoadUsersBudgets({ users }))
  );

  @Effect()
  loadUsersBudgets$ = this.actions$.pipe(
    ofType<actions.LoadUsersBudgets>(actions.UsersActionTypes.LoadUsersBudgets),
    mapToPayloadProperty('users'),
    mergeMap(users => [...users.map(user => new actions.LoadUserBudgets({ user }))])
  );

  @Effect()
  loadUserBudgets$ = this.actions$.pipe(
    ofType<actions.LoadUserBudgets>(actions.UsersActionTypes.LoadUserBudgets),
    mapToPayloadProperty('user'),
    mergeMap(user =>
      this.usersService
        .getUserBudgets(user.email)
        .pipe(
          map(
            userBudgets => new actions.LoadUserBudgetsSuccess({ user, userBudgets }),
            mapErrorToAction(actions.LoadUserBudgetsFail)
          )
        )
    )
  );
}
