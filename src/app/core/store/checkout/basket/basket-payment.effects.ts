import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import * as basketActions from './basket.actions';
import { getCurrentBasket } from './basket.selectors';

@Injectable()
export class BasketPaymentEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private basketService: BasketService) {}

  /**
   * The load basket eligible payment methods effect.
   */
  @Effect()
  loadBasketEligiblePaymentMethods$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketEligiblePaymentMethods),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([, basket]) =>
      this.basketService.getBasketEligiblePaymentMethods(basket.id).pipe(
        map(result => new basketActions.LoadBasketEligiblePaymentMethodsSuccess({ paymentMethods: result })),
        mapErrorToAction(basketActions.LoadBasketEligiblePaymentMethodsFail)
      )
    )
  );

  /**
   * Sets a payment at the current basket.
   */
  @Effect()
  setPaymentAtBasket$ = this.actions$.pipe(
    ofType<basketActions.SetBasketPayment>(basketActions.BasketActionTypes.SetBasketPayment),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([paymentInstrumentId, basket]) =>
      this.basketService.setBasketPayment(basket.id, paymentInstrumentId).pipe(
        mapTo(new basketActions.SetBasketPaymentSuccess()),
        mapErrorToAction(basketActions.SetBasketPaymentFail)
      )
    )
  );

  /**
   * Creates a payment at the current basket.
   */
  @Effect()
  createBasketPaymentInstrument$ = this.actions$.pipe(
    ofType<basketActions.CreateBasketPayment>(basketActions.BasketActionTypes.CreateBasketPayment),
    mapToPayloadProperty('paymentInstrument'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([paymentInstrument, basket]) =>
      this.basketService.createBasketPayment(basket.id, paymentInstrument).pipe(
        concatMap(payload => [
          new basketActions.SetBasketPayment({ id: payload.id }),
          new basketActions.CreateBasketPaymentSuccess(),
        ]),
        mapErrorToAction(basketActions.CreateBasketPaymentFail)
      )
    )
  );

  /**
   * Deletes a payment instrument and the related payment at the current basket.
   */
  @Effect()
  deleteBasketPaymentInstrument$ = this.actions$.pipe(
    ofType<basketActions.DeleteBasketPayment>(basketActions.BasketActionTypes.DeleteBasketPayment),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([paymentInstrumentId, basket]) =>
      this.basketService.deleteBasketPaymentInstrument(basket.id, paymentInstrumentId).pipe(
        mapTo(new basketActions.DeleteBasketPaymentSuccess()),
        mapErrorToAction(basketActions.DeleteBasketPaymentFail)
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketChangeSuccess$ = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.SetBasketPaymentSuccess,
      basketActions.BasketActionTypes.SetBasketPaymentFail,
      basketActions.BasketActionTypes.DeleteBasketPaymentSuccess
    ),
    mapTo(new basketActions.LoadBasket())
  );

  /**
   * Triggers a LoadEligiblePaymentMethods action after successful delete a eligible Payment Instrument.
   */
  @Effect()
  loadBasketEligiblePaymentMethodsAfterChange$ = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.DeleteBasketPaymentSuccess,
      basketActions.BasketActionTypes.CreateBasketPaymentSuccess
    ),
    mapTo(new basketActions.LoadBasketEligiblePaymentMethods())
  );
}
