import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { concatMap, mapTo } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import * as basketActions from './basket.actions';

@Injectable()
export class BasketPromotionCodeEffects {
  constructor(private actions$: Actions, private basketService: BasketService) {}

  /**
   * Add promotion code to the current basket.
   */
  @Effect()
  addPromotionCodeToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddPromotionCodeToBasket>(basketActions.BasketActionTypes.AddPromotionCodeToBasket),
    mapToPayloadProperty('code'),
    concatMap(code =>
      this.basketService
        .addPromotionCodeToBasket(code)
        .pipe(
          mapTo(new basketActions.AddPromotionCodeToBasketSuccess()),
          mapErrorToAction(basketActions.AddPromotionCodeToBasketFail)
        )
    )
  );

  /**
   * Reload basket after successfully adding a promo code
   */
  @Effect()
  loadBasketAfterAddPromotionCodeToBasketChangeSuccess$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.AddPromotionCodeToBasketSuccess),
    mapTo(new basketActions.LoadBasket())
  );

  /**
   * Remove promotion code from the current basket.
   */
  @Effect()
  removePromotionCodeFromBasket$ = this.actions$.pipe(
    ofType<basketActions.RemovePromotionCodeFromBasket>(basketActions.BasketActionTypes.RemovePromotionCodeFromBasket),
    mapToPayloadProperty('code'),
    concatMap(code =>
      this.basketService
        .removePromotionCodeFromBasket(code)
        .pipe(
          mapTo(new basketActions.RemovePromotionCodeFromBasketSuccess()),
          mapErrorToAction(basketActions.RemovePromotionCodeFromBasketFail)
        )
    )
  );

  /**
   * Reload basket after successfully removing a promo code
   */
  @Effect()
  loadBasketAfterRemovePromotionCodeFromBasketChangeSuccess$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.RemovePromotionCodeFromBasketSuccess),
    mapTo(new basketActions.LoadBasket())
  );
}
