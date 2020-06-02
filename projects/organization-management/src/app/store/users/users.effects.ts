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
  extendUsersRoles$ = this.actions$.pipe(
    ofType<actions.LoadUsersSuccess>(actions.UsersActionTypes.LoadUsersSuccess),
    mapToPayloadProperty('users'),
    map(users => new actions.LoadUsersRoles({ users }))
  );

  @Effect()
  loadUsersRoles$ = this.actions$.pipe(
    ofType<actions.LoadUsersRoles>(actions.UsersActionTypes.LoadUsersRoles),
    mapToPayloadProperty('users'),
    mergeMap(users => [...users.map(user => new actions.LoadUserRoles({ user }))])
  );

  @Effect()
  loadUserRoles$ = this.actions$.pipe(
    ofType<actions.LoadUserRoles>(actions.UsersActionTypes.LoadUserRoles),
    mapToPayloadProperty('user'),
    mergeMap(user =>
      this.usersService
        .getUserRoles(user.email)
        .pipe(
          map(
            userRoles => new actions.LoadUserRolesSuccess({ user, userRoles }),
            mapErrorToAction(actions.LoadUserRolesFail)
          )
        )
    )
  );
}
