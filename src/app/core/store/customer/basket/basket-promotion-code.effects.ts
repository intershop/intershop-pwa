import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, mapTo, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  addPromotionCodeToBasket,
  addPromotionCodeToBasketFail,
  addPromotionCodeToBasketSuccess,
  loadBasket,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
} from './basket.actions';
import { getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketPromotionCodeEffects {
  constructor(private actions$: Actions, private store: Store, private basketService: BasketService) {}

  /**
   * Add promotion code to the current basket.
   */
  addPromotionCodeToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPromotionCodeToBasket),
      mapToPayloadProperty('code'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([code, basketId]) =>
        this.basketService
          .addPromotionCodeToBasket(basketId, code)
          .pipe(mapTo(addPromotionCodeToBasketSuccess()), mapErrorToAction(addPromotionCodeToBasketFail))
      )
    )
  );

  /**
   * Reload basket after successfully adding a promo code
   */
  loadBasketAfterAddPromotionCodeToBasketChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(ofType(addPromotionCodeToBasketSuccess), mapTo(loadBasket()))
  );

  /**
   * Remove promotion code from the current basket.
   */
  removePromotionCodeFromBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePromotionCodeFromBasket),
      mapToPayloadProperty('code'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([code, basketId]) =>
        this.basketService
          .removePromotionCodeFromBasket(basketId, code)
          .pipe(mapTo(removePromotionCodeFromBasketSuccess()), mapErrorToAction(removePromotionCodeFromBasketFail))
      )
    )
  );

  /**
   * Reload basket after successfully removing a promo code
   */
  loadBasketAfterRemovePromotionCodeFromBasketChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(ofType(removePromotionCodeFromBasketSuccess), mapTo(loadBasket()))
  );
}
