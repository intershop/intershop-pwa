import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, mapTo } from 'rxjs/operators';

import { displayErrorMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import {
  transferPunchoutBasket,
  transferPunchoutBasketFail,
  transferPunchoutBasketSuccess,
} from './punchout-functions.actions';

@Injectable()
export class PunchoutFunctionsEffects {
  constructor(private punchoutService: PunchoutService, private actions$: Actions) {}

  transferPunchoutBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(transferPunchoutBasket),
      concatMap(() =>
        this.punchoutService
          .transferPunchoutBasket()
          .pipe(mapTo(transferPunchoutBasketSuccess()), mapErrorToAction(transferPunchoutBasketFail))
      )
    )
  );

  displayPunchoutErrorMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(transferPunchoutBasketFail),
      mapToPayloadProperty('error'),
      map(error =>
        displayErrorMessage({
          message: error.message,
        })
      )
    )
  );
}
