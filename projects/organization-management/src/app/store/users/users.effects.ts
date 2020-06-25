import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, exhaustMap, filter, map, mapTo, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectPath, selectRouteParam } from 'ish-core/store/core/router';
import { loadRolesAndPermissions } from 'ish-core/store/customer/authorization';
import { getLoggedInUser, loadCompanyUser } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { UsersService } from '../../services/users/users.service';

import {
  addUser,
  addUserFail,
  addUserSuccess,
  deleteUser,
  deleteUserFail,
  deleteUserSuccess,
  loadSystemUserRolesSuccess,
  loadUserFail,
  loadUserSuccess,
  loadUsers,
  loadUsersFail,
  loadUsersSuccess,
  setUserBudgets,
  setUserBudgetsFail,
  setUserBudgetsSuccess,
  setUserRoles,
  setUserRolesFail,
  setUserRolesSuccess,
  updateUser,
  updateUserFail,
  updateUserSuccess,
} from './users.actions';
import { getSelectedUser, isSystemUserRolesLoaded } from './users.selectors';

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

  loadSystemRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      withLatestFrom(this.store.pipe(select(isSystemUserRolesLoaded))),
      filter(([, loaded]) => !loaded),
      switchMap(() => this.usersService.getAvailableRoles().pipe(map(roles => loadSystemUserRolesSuccess({ roles }))))
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addUser),
      mapToPayloadProperty('user'),
      concatMap(newUser =>
        this.usersService.addUser(newUser).pipe(
          tap(user => {
            this.navigateTo('../' + user.login);
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
          map(user => updateUserSuccess({ user })),
          mapErrorToAction(updateUserFail)
        )
      )
    )
  );

  redirectAfterUpdateUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateUserSuccess),
        tap(() => {
          this.navigateTo('../');
        })
      ),
    { dispatch: false }
  );

  setUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setUserRoles),
      mapToPayload(),
      mergeMap(({ login, roles }) =>
        this.usersService.setUserRoles(login, roles).pipe(
          withLatestFrom(this.store.pipe(select(selectPath))),
          tap(([, path]) => {
            if (path?.endsWith('users/:B2BCustomerLogin/roles')) {
              this.navigateTo('../../' + login);
            }
          }),
          map(([newRoles]) => setUserRolesSuccess({ login, roles: newRoles })),
          mapErrorToAction(setUserRolesFail, { login })
        )
      )
    )
  );

  updateCurrentUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setUserRolesSuccess),
      mapToPayloadProperty('login'),
      withLatestFrom(this.store.pipe(select(getLoggedInUser))),
      filter(([login, currentUser]) => login === currentUser.login),
      mapTo(loadRolesAndPermissions())
    )
  );

  setUserBudgets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setUserBudgets),
      mapToPayload(),
      mergeMap(({ login, budgets }) =>
        this.usersService.setUserBudgets(login, budgets).pipe(
          withLatestFrom(this.store.pipe(select(selectPath))),
          tap(([, path]) => {
            if (path?.endsWith('users/:B2BCustomerLogin/budget')) {
              this.navigateTo('../../' + login);
            }
          }),
          map(([newBudgets]) => setUserBudgetsSuccess({ login, budgets: newBudgets })),
          mapErrorToAction(setUserBudgetsFail, { login })
        )
      )
    )
  );

  refreshLoggedInUserAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserSuccess),
      mapToPayloadProperty('user'),
      withLatestFrom(this.store.pipe(select(getLoggedInUser), whenTruthy())),
      filter(([updatedUser, currentUser]) => updatedUser.login === currentUser.login),
      mapTo(loadCompanyUser())
    )
  );

  updateCurrentUserBudgets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setUserBudgetsSuccess),
      mapToPayloadProperty('login'),
      withLatestFrom(this.store.pipe(select(getLoggedInUser))),
      filter(([login, currentUser]) => login === currentUser.login),
      mapTo(loadRolesAndPermissions())
    )
  );

  successMessageAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserSuccess, setUserRolesSuccess, setUserBudgetsSuccess),
      withLatestFrom(this.store.pipe(select(getSelectedUser), whenTruthy())),
      map(([, user]) =>
        displaySuccessMessage({
          message: 'account.organization.user_management.update_user.confirmation',
          messageParams: { 0: `${user.firstName} ${user.lastName}` },
        })
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      mapToPayloadProperty('login'),
      exhaustMap(login =>
        this.usersService.deleteUser(login).pipe(
          mergeMap(() => [
            deleteUserSuccess({ login }),
            displaySuccessMessage({
              message: 'account.user.delete_user.confirmation',
            }),
          ]),
          mapErrorToAction(deleteUserFail)
        )
      )
    )
  );

  private navigateTo(path: string): void {
    // find current ActivatedRoute by following first activated children
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    this.router.navigate([path], { relativeTo: currentRoute });
  }
}
