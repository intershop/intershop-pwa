import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, mapTo, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';
import { BasketService } from '../../../services/basket/basket.service';

import * as basketActions from './basket.actions';
import { getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketPromotionCodeEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private basketService: BasketService) {}

  /**
   * Add promotion code to the current basket.
   */
  @Effect()
  addPromotionCodeToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddPromotionCodeToBasket>(basketActions.BasketActionTypes.AddPromotionCodeToBasket),
    mapToPayloadProperty('code'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([code, basketId]) =>
      this.basketService.addPromotionCodeToBasket(basketId, code).pipe(
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
}
