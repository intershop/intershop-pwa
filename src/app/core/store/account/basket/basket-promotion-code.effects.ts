import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, mapTo, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  AddPromotionCodeToBasket,
  AddPromotionCodeToBasketFail,
  AddPromotionCodeToBasketSuccess,
  BasketActionTypes,
  LoadBasket,
  RemovePromotionCodeFromBasket,
  RemovePromotionCodeFromBasketFail,
  RemovePromotionCodeFromBasketSuccess,
} from './basket.actions';
import { getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketPromotionCodeEffects {
  constructor(private actions$: Actions, private store: Store, private basketService: BasketService) {}

  /**
   * Add promotion code to the current basket.
   */
  @Effect()
  addPromotionCodeToBasket$ = this.actions$.pipe(
    ofType<AddPromotionCodeToBasket>(BasketActionTypes.AddPromotionCodeToBasket),
    mapToPayloadProperty('code'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([code, basketId]) =>
      this.basketService
        .addPromotionCodeToBasket(basketId, code)
        .pipe(mapTo(new AddPromotionCodeToBasketSuccess()), mapErrorToAction(AddPromotionCodeToBasketFail))
    )
  );

  /**
   * Reload basket after successfully adding a promo code
   */
  @Effect()
  loadBasketAfterAddPromotionCodeToBasketChangeSuccess$ = this.actions$.pipe(
    ofType(BasketActionTypes.AddPromotionCodeToBasketSuccess),
    mapTo(new LoadBasket())
  );

  /**
   * Remove promotion code from the current basket.
   */
  @Effect()
  removePromotionCodeFromBasket$ = this.actions$.pipe(
    ofType<RemovePromotionCodeFromBasket>(BasketActionTypes.RemovePromotionCodeFromBasket),
    mapToPayloadProperty('code'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([code, basketId]) =>
      this.basketService
        .removePromotionCodeFromBasket(basketId, code)
        .pipe(mapTo(new RemovePromotionCodeFromBasketSuccess()), mapErrorToAction(RemovePromotionCodeFromBasketFail))
    )
  );

  /**
   * Reload basket after successfully removing a promo code
   */
  @Effect()
  loadBasketAfterRemovePromotionCodeFromBasketChangeSuccess$ = this.actions$.pipe(
    ofType(BasketActionTypes.RemovePromotionCodeFromBasketSuccess),
    mapTo(new LoadBasket())
  );
}
