import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, mergeMap, tap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

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
} from './oci-punchout.actions';

@Injectable()
export class OciPunchoutEffects {
  constructor(private punchoutService: PunchoutService, private actions$: Actions, private router: Router) {}

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

  createPunchoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPunchoutUser),
      mapToPayloadProperty('user'),
      mergeMap(newUser =>
        this.punchoutService.createUser(newUser).pipe(
          tap(() => {
            // ToDo: go To account/punchout/<id> page
            this.router.navigate(['/account/punchout']);
          }),
          mergeMap(user => [
            addPunchoutUserSuccess({ user }),
            displaySuccessMessage({
              message: 'account.punchout.connection.created.message',
              messageParams: { 0: `${user.login}` },
            }),
          ]),
          mapErrorToAction(addPunchoutUserFail)
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
              message: 'account.punchout.connection.delete.confirmation',
              messageParams: { 0: `${login}` },
            }),
          ]),
          mapErrorToAction(deletePunchoutUserFail)
        )
      )
    )
  );
}
