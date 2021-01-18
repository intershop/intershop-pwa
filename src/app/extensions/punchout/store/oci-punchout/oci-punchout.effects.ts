import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, exhaustMap, filter, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { getCurrentBasketId } from 'ish-core/store/customer/basket';
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
  startOCIPunchout,
  startOCIPunchoutFail,
  startOCIPunchoutSuccess,
} from './oci-punchout.actions';

@Injectable()
export class OciPunchoutEffects {
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
              message: 'account.punchout.user.created.message',
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
              message: 'account.punchout.user.delete.confirmation',
              messageParams: { 0: `${login}` },
            }),
          ]),
          mapErrorToAction(deletePunchoutUserFail)
        )
      )
    )
  );

  transferPunchoutBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startOCIPunchout),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([, basketId]) => !!basketId),
      concatMap(([, basketId]) =>
        this.punchoutService.getOciPunchoutData(basketId).pipe(
          concatMap(data => this.punchoutService.submitOciPunchoutData(data)),
          mapTo(startOCIPunchoutSuccess()),
          mapErrorToAction(startOCIPunchoutFail)
        )
      )
    )
  );

  displayPunchoutErrorMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startOCIPunchoutFail),
      mapToPayloadProperty('error'),
      map(error =>
        displayErrorMessage({
          message: error.message,
        })
      )
    )
  );
}
