import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { from } from 'rxjs';
import {
  concatMap,
  exhaustMap,
  filter,
  map,
  mapTo,
  mergeMap,
  mergeMapTo,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

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
  setUserBudget,
  setUserBudgetFail,
  setUserBudgetSuccess,
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
          concatMap(user =>
            this.navigateTo('../' + user.login).pipe(
              mergeMapTo([
                addUserSuccess({ user }),
                displaySuccessMessage({
                  message: 'account.organization.user_management.new_user.confirmation',
                  messageParams: { 0: `${user.firstName} ${user.lastName}` },
                }),
              ])
            )
          ),
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
        concatMap(() => this.navigateTo('../'))
      ),
    { dispatch: false }
  );

  setUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setUserRoles),
      mapToPayload(),
      mergeMap(({ login, roles }) =>
        this.usersService.setUserRoles(login, roles).pipe(
          map(newRoles => setUserRolesSuccess({ login, roles: newRoles })),
          mapErrorToAction(setUserRolesFail, { login })
        )
      )
    )
  );

  redirectToUserDetailAfterUpdatingRoles$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setUserRolesSuccess),
        withLatestFrom(this.store.pipe(select(selectPath))),
        filter(([, path]) => path?.endsWith('users/:B2BCustomerLogin/roles')),
        concatMap(() => this.navigateTo('../'))
      ),
    { dispatch: false }
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

  setUserBudget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setUserBudget),
      mapToPayload(),
      mergeMap(({ login, budget }) =>
        this.usersService.setUserBudget(login, budget).pipe(
          map(newBudget => setUserBudgetSuccess({ login, budget: newBudget })),
          mapErrorToAction(setUserBudgetFail, { login })
        )
      )
    )
  );

  redirectToUserDetailsAfterUpdatingBudgets$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setUserBudgetSuccess),
        withLatestFrom(this.store.pipe(select(selectPath))),
        filter(([, path]) => path?.endsWith('users/:B2BCustomerLogin/budget')),
        concatMap(() => this.navigateTo('../'))
      ),
    { dispatch: false }
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

  updateCurrentUserBudget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setUserBudgetSuccess),
      mapToPayloadProperty('login'),
      withLatestFrom(this.store.pipe(select(getLoggedInUser))),
      filter(([login, currentUser]) => login === currentUser.login),
      mapTo(loadRolesAndPermissions())
    )
  );

  successMessageAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserSuccess, setUserRolesSuccess, setUserBudgetSuccess),
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

  private navigateTo(path: string) {
    // find current ActivatedRoute by following first activated children
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return from(this.router.navigate([path], { relativeTo: currentRoute }));
  }
}
