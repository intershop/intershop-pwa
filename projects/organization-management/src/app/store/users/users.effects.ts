import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs/operators';

import { mapErrorToAction } from 'ish-core/utils/operators';

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
}
