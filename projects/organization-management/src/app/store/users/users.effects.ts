import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, debounceTime, exhaustMap, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { getLoggedInCustomer, logoutUser } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

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
  resetUsers,
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
      debounceTime(0), // necessary to wait for the login after refreshing the page
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
      mapToPayload(),
      withLatestFrom(this.store.pipe<Customer>(select(getLoggedInCustomer))),
      concatMap(([payload, customer]) =>
        this.usersService.addUser({ user: payload.user, customer }).pipe(
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
      mapToPayload(),
      withLatestFrom(this.store.pipe<Customer>(select(getLoggedInCustomer))),
      concatMap(([payload, customer]) =>
        this.usersService.updateUser({ user: payload.user, customer }).pipe(
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

  resetUsersAfterLogout$ = createEffect(() => this.actions$.pipe(ofType(logoutUser), mapTo(resetUsers())));

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
