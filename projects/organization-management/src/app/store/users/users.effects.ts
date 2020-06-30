import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, exhaustMap, map, mapTo, mergeMap, withLatestFrom } from 'rxjs/operators';

import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { logoutUser } from 'ish-core/store/customer/user';
import { mapErrorToAction, whenTruthy } from 'ish-core/utils/operators';

import { UsersService } from '../../services/users/users.service';

import { loadUserFail, loadUserSuccess, loadUsers, loadUsersFail, loadUsersSuccess, resetUsers } from './users.actions';
import { getSelectedUser } from './users.selectors';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private store: Store,
    private translateService: TranslateService
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

  setUserDetailBreadcrumb$ = createEffect(() =>
    this.store.pipe(
      select(getSelectedUser),
      whenTruthy(),
      withLatestFrom(this.translateService.get('account.organization.user_management.user_detail.breadcrumb')),
      map(([user, prefixBreadcrumb]) =>
        setBreadcrumbData({
          breadcrumbData: [
            { key: 'account.organization.user_management', link: '/account/organization/users' },
            { text: `${prefixBreadcrumb} - ${user.firstName} ${user.lastName}` },
          ],
        })
      )
    )
  );

  resetUsersAfterLogout$ = createEffect(() => this.actions$.pipe(ofType(logoutUser), mapTo(resetUsers())));
}
