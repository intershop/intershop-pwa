import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { exhaustMap, map, mergeMap, tap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import {
  addPunchoutUser,
  addPunchoutUserFail,
  addPunchoutUserSuccess,
  deletePunchoutUser,
  deletePunchoutUserFail,
  deletePunchoutUserSuccess,
  loadPunchoutUsers,
  loadPunchoutUsersFail,
  loadPunchoutUsersSuccess,
  updatePunchoutUser,
  updatePunchoutUserFail,
  updatePunchoutUserSuccess,
} from './punchout-users.actions';

@Injectable()
export class PunchoutUsersEffects {
  constructor(
    private punchoutService: PunchoutService,
    private actions$: Actions,
    private router: Router,
    private store: Store
  ) {}

  loadPunchoutUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPunchoutUsers),
      mergeMap(() =>
        this.punchoutService.getUsers().pipe(
          map(users => loadPunchoutUsersSuccess({ users })),
          mapErrorToAction(loadPunchoutUsersFail)
        )
      )
    )
  );

  loadDetailedUser$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('PunchoutLogin')),
      whenTruthy(),
      mergeMap(() =>
        this.punchoutService.getUsers().pipe(
          map(users => loadPunchoutUsersSuccess({ users })),
          mapErrorToAction(loadPunchoutUsersFail)
        )
      )
    )
  );

  createPunchoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPunchoutUser),
      mapToPayloadProperty('user'),
      mergeMap(newUser =>
        this.punchoutService.createUser(newUser).pipe(
          tap(() => {
            this.router.navigate([`/account/punchout`]);
          }),
          mergeMap(user => [
            addPunchoutUserSuccess({ user }),
            displaySuccessMessage({
              message: 'account.punchout.user.created.message',
              messageParams: { 0: `${user.login}` },
            }),
          ]),
          mapErrorToAction(addPunchoutUserFail)
        )
      )
    )
  );

  updatePunchoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePunchoutUser),
      mapToPayloadProperty('user'),
      mergeMap(changedUser =>
        this.punchoutService.updateUser(changedUser).pipe(
          tap(() => {
            this.router.navigate([`/account/punchout`]);
          }),
          mergeMap(user => [
            updatePunchoutUserSuccess({ user }),
            displaySuccessMessage({
              message: 'account.punchout.user.updated.message',
              messageParams: { 0: `${user.login}` },
            }),
          ]),
          mapErrorToAction(updatePunchoutUserFail)
        )
      )
    )
  );

  deletePunchoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePunchoutUser),
      mapToPayloadProperty('login'),
      exhaustMap(login =>
        this.punchoutService.deleteUser(login).pipe(
          mergeMap(() => [
            deletePunchoutUserSuccess({ login }),
            displaySuccessMessage({
              message: 'account.punchout.user.delete.confirmation',
              messageParams: { 0: `${login}` },
            }),
          ]),
          mapErrorToAction(deletePunchoutUserFail)
        )
      )
    )
  );
}
