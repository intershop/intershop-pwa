import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { exhaustMap, map } from 'rxjs/operators';

import { SetBreadcrumbData } from 'ish-core/store/viewconf';
import { mapErrorToAction, whenTruthy } from 'ish-core/utils/operators';

import { UsersService } from '../../services/users/users.service';

import * as actions from './users.actions';
import { getCurrentUser } from './users.selectors';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersService: UsersService, private store: Store) {}

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
  setUserDetailBreadcrumb$ = this.store.pipe(
    select(getCurrentUser),
    whenTruthy(),
    map(
      user =>
        new SetBreadcrumbData({
          breadcrumbData: [
            { key: 'account.organization.user_management', link: '/account/organization/users' },
            { text: `${user.firstName} ${user.lastName}` },
          ],
        })
    )
  );
}
