import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ofRoute } from 'ngrx-router';
import { concatMap, filter, map, mapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { PaymentService } from 'ish-core/services/payment/payment.service';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import * as basketActions from './basket.actions';
import { getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketPaymentEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private paymentService: PaymentService) {}

  /**
   * The load basket eligible payment methods effect.
   */
  @Effect()
  loadBasketEligiblePaymentMethods$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketEligiblePaymentMethods),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([, basketid]) =>
      this.paymentService.getBasketEligiblePaymentMethods(basketid).pipe(
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
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([paymentInstrumentId, basketid]) =>
      this.paymentService.setBasketPayment(basketid, paymentInstrumentId).pipe(
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
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([paymentInstrument, basketid]) =>
      this.paymentService.createBasketPayment(basketid, paymentInstrument).pipe(
        concatMap(payload => [
          new basketActions.SetBasketPayment({ id: payload.id }),
          new basketActions.CreateBasketPaymentSuccess(),
        ]),
        mapErrorToAction(basketActions.CreateBasketPaymentFail)
      )
    )
  );

  /**
   * Checks, if the page is called with redirect query params and sends them to the server ( only RedirectBeforeCheckout)
   */
  @Effect()
  sendPaymentRedirectData$ = this.actions$.pipe(
    ofRoute(['checkout/payment', 'checkout/review']),
    mapToPayloadProperty('queryParams'),
    // don't do anything in case of RedirectAfterCheckout
    filter(queryParams => queryParams && queryParams.redirect && !queryParams.orderId),
    switchMap(queryParams =>
      this.store.pipe(
        select(getCurrentBasketId),
        whenTruthy(),
        take(1),
        mapTo(new basketActions.UpdateBasketPayment({ params: queryParams }))
      )
    )
  );

  /**
   * Updates a basket payment concerning redirect data.
   */
  @Effect()
  updateBasketPayment$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketPayment>(basketActions.BasketActionTypes.UpdateBasketPayment),
    mapToPayloadProperty('params'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([params, basketid]) =>
      this.paymentService.updateBasketPayment(basketid, params).pipe(
        mapTo(new basketActions.UpdateBasketPaymentSuccess()),
        mapErrorToAction(basketActions.UpdateBasketPaymentFail)
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
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([paymentInstrumentId, basketid]) =>
      this.paymentService.deleteBasketPaymentInstrument(basketid, paymentInstrumentId).pipe(
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
      basketActions.BasketActionTypes.UpdateBasketPaymentSuccess,
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
