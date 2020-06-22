import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, exhaustMap, map, mapTo, withLatestFrom } from 'rxjs/operators';

import { selectRouteParam } from 'ish-core/store/router';
import { UserActionTypes } from 'ish-core/store/user';
import { SetBreadcrumbData } from 'ish-core/store/viewconf';
import { mapErrorToAction, whenTruthy } from 'ish-core/utils/operators';

import { UsersService } from '../../services/users/users.service';

import * as actions from './users.actions';
import { getSelectedUser } from './users.selectors';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private store: Store,
    private translateService: TranslateService
  ) {}

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType<actions.LoadUsers>(actions.UsersActionTypes.LoadUsers),
    exhaustMap(() =>
      this.usersService.getUsers().pipe(
        map(users => new actions.LoadUsersSuccess({ users })),
        mapErrorToAction(actions.LoadUsersFail)
      )
    )
  );

  @Effect()
  loadDetailedUser$ = this.store.pipe(
    select(selectRouteParam('B2BCustomerLogin')),
    whenTruthy(),
    debounceTime(0), // necessary to wait for the login after refreshing the page
    exhaustMap(login =>
      this.usersService.getUser(login).pipe(
        map(user => new actions.LoadUserSuccess({ user })),
        mapErrorToAction(actions.LoadUserFail)
      )
    )
  );

  @Effect()
  setUserDetailBreadcrumb$ = this.store.pipe(
    select(getSelectedUser),
    whenTruthy(),
    withLatestFrom(this.translateService.get('account.organization.user_management.user_detail.breadcrumb')),
    map(
      ([user, prefixBreadcrumb]) =>
        new SetBreadcrumbData({
          breadcrumbData: [
            { key: 'account.organization.user_management', link: '/account/organization/users' },
            { text: `${prefixBreadcrumb} - ${user.firstName} ${user.lastName}` },
          ],
        })
    )
  );

  @Effect()
  resetUsersAfterLogout$ = this.actions$.pipe(ofType(UserActionTypes.LogoutUser), mapTo(new actions.ResetUsers()));
}
