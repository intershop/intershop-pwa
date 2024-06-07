import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs/operators';

import { UserService } from 'ish-core/services/user/user.service';
import { loadCompanyUserSuccess } from 'ish-core/store/customer/user/user.actions';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { loadCustomerUsers, loadCustomerUsersFail, loadCustomerUsersSuccess } from './users.actions';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  triggerLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCompanyUserSuccess),
      map(() => loadCustomerUsers())
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerUsers),
      exhaustMap(() =>
        this.userService.getUsers().pipe(
          map(users => loadCustomerUsersSuccess({ users })),
          mapErrorToAction(loadCustomerUsersFail)
        )
      )
    )
  );
}
