import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, withLatestFrom } from 'rxjs/operators';

import { displayErrorMessage } from 'ish-core/store/core/messages';
import { getCurrentBasketId } from 'ish-core/store/customer/basket';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import {
  transferPunchoutBasket,
  transferPunchoutBasketFail,
  transferPunchoutBasketSuccess,
} from './punchout-functions.actions';

@Injectable()
export class PunchoutFunctionsEffects {
  constructor(private punchoutService: PunchoutService, private actions$: Actions, private store: Store) {}

  transferPunchoutBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(transferPunchoutBasket),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([, basketId]) => !!basketId),
      concatMap(([, basketId]) =>
        this.punchoutService.getBasketPunchoutData(basketId).pipe(
          map(data => this.punchoutService.submitPunchoutData(data)),
          mapTo(transferPunchoutBasketSuccess()),
          mapErrorToAction(transferPunchoutBasketFail)
        )
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
