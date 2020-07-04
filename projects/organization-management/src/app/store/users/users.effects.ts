import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { UsersService } from '../../services/users/users.service';

import {
  addUser,
  addUserFail,
  addUserSuccess,
  deleteUser,
  deleteUserFail,
  deleteUserSuccess,
  loadUserFail,
  loadUserSuccess,
  loadUsers,
  loadUsersFail,
  loadUsersSuccess,
  updateUser,
  updateUserFail,
  updateUserSuccess,
} from './users.actions';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private store: Store,
    private router: Router
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      exhaustMap(() =>
        this.usersService.getUsers().pipe(
          map(users => loadUsersSuccess({ users })),
          mapErrorToAction(loadUsersFail)
        )
      )
    )
  );

  loadDetailedUser$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('B2BCustomerLogin')),
      whenTruthy(),
      mergeMap(login =>
        this.usersService.getUser(login).pipe(
          map(user => loadUserSuccess({ user })),
          mapErrorToAction(loadUserFail)
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addUser),
      mapToPayloadProperty('user'),
      concatMap(newUser =>
        this.usersService.addUser(newUser).pipe(
          tap(() => {
            this.navigateToParent();
          }),
          mergeMap(user => [
            addUserSuccess({ user }),
            displaySuccessMessage({
              message: 'account.organization.user_management.new_user.confirmation',
              messageParams: { 0: `${user.firstName} ${user.lastName}` },
            }),
          ]),
          mapErrorToAction(addUserFail)
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mapToPayloadProperty('user'),
      concatMap(editUser =>
        this.usersService.updateUser(editUser).pipe(
          tap(() => {
            this.navigateToParent();
          }),
          mergeMap(user => [
            updateUserSuccess({ user }),
            displaySuccessMessage({
              message: 'account.organization.user_management.update_user.confirmation',
              messageParams: { 0: `${user.firstName} ${user.lastName}` },
            }),
          ]),
          mapErrorToAction(updateUserFail)
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      mapToPayloadProperty('login'),
      exhaustMap(login =>
        this.usersService
          .deleteUser(login)
          .pipe(map(() => deleteUserSuccess({ login }), mapErrorToAction(deleteUserFail)))
      )
    )
  );

  private navigateToParent(): void {
    // find current ActivatedRoute by following first activated children
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    this.router.navigate(['../'], { relativeTo: currentRoute });
  }
}
