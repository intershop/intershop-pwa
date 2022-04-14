import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { from } from 'rxjs';
import { concatMap, exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { PunchoutType } from '../../models/punchout-user/punchout-user.model';
import { PunchoutService } from '../../services/punchout/punchout.service';
import { loadPunchoutTypesSuccess } from '../punchout-types';

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

  loadPunchoutUsersOnChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPunchoutTypesSuccess),
      mapToPayloadProperty('types'),
      withLatestFrom(this.store.pipe(select(selectRouteParam('format')))),
      map(([types, selectedType]) => loadPunchoutUsers({ type: (selectedType as PunchoutType) || types[0] }))
    )
  );

  loadPunchoutUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPunchoutUsers),
      mapToPayloadProperty('type'),
      concatMap(type =>
        this.punchoutService.getUsers(type).pipe(
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
      withLatestFrom(this.store.pipe(select(selectRouteParam('format')))),
      concatMap(([, format]) =>
        this.punchoutService.getUsers(format as PunchoutType).pipe(
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
      concatMap(newUser =>
        this.punchoutService.createUser(newUser).pipe(
          concatMap(user =>
            from(this.router.navigate([`/account/punchout`, { format: user.punchoutType }])).pipe(
              mergeMap(() => [
                addPunchoutUserSuccess({ user }),
                displaySuccessMessage({
                  message: 'account.punchout.user.created.message',
                  messageParams: { 0: `${user.login}` },
                }),
              ])
            )
          ),
          mapErrorToAction(addPunchoutUserFail)
        )
      )
    )
  );

  updatePunchoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePunchoutUser),
      mapToPayloadProperty('user'),
      concatMap(changedUser =>
        this.punchoutService.updateUser(changedUser).pipe(
          concatMap(user =>
            from(this.router.navigate([`/account/punchout`, { format: user.punchoutType }])).pipe(
              mergeMap(() => [
                updatePunchoutUserSuccess({ user }),
                displaySuccessMessage({
                  message: 'account.punchout.user.updated.message',
                  messageParams: { 0: `${user.login}` },
                }),
              ])
            )
          ),
          mapErrorToAction(updatePunchoutUserFail)
        )
      )
    )
  );

  deletePunchoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePunchoutUser),
      mapToPayloadProperty('user'),
      exhaustMap(user =>
        this.punchoutService.deleteUser(user).pipe(
          mergeMap(() => [
            deletePunchoutUserSuccess({ login: user.login }),
            displaySuccessMessage({
              message: 'account.punchout.user.delete.confirmation',
              messageParams: { 0: user.login },
            }),
          ]),
          mapErrorToAction(deletePunchoutUserFail)
        )
      )
    )
  );
}
