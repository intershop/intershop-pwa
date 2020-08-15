import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { PaymentService } from 'ish-core/services/payment/payment.service';
import { ofUrl, selectQueryParams } from 'ish-core/store/core/router';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  loadBasket,
  loadBasketEligiblePaymentMethods,
  loadBasketEligiblePaymentMethodsFail,
  loadBasketEligiblePaymentMethodsSuccess,
  setBasketPayment,
  setBasketPaymentFail,
  setBasketPaymentSuccess,
  updateBasketPayment,
  updateBasketPaymentFail,
  updateBasketPaymentSuccess,
  updateCvcLastUpdated,
  updateCvcLastUpdatedFail,
  updateCvcLastUpdatedSuccess,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketPaymentEffects {
  constructor(private actions$: Actions, private store: Store, private paymentService: PaymentService) {}

  /**
   * The load basket eligible payment methods effect.
   */
  loadBasketEligiblePaymentMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketEligiblePaymentMethods),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([, basketid]) =>
        this.paymentService.getBasketEligiblePaymentMethods(basketid).pipe(
          map(result => loadBasketEligiblePaymentMethodsSuccess({ paymentMethods: result })),
          mapErrorToAction(loadBasketEligiblePaymentMethodsFail)
        )
      )
    )
  );

  /**
   * Sets a payment at the current basket.
   */
  setPaymentAtBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setBasketPayment),
      mapToPayloadProperty('id'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([paymentInstrumentId, basketid]) =>
        this.paymentService
          .setBasketPayment(basketid, paymentInstrumentId)
          .pipe(mapTo(setBasketPaymentSuccess()), mapErrorToAction(setBasketPaymentFail))
      )
    )
  );

  /**
   * Creates a payment instrument at the current basket or user respectively - and saves it as payment at basket.
   */
  createBasketPaymentInstrument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBasketPayment),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      map(([payload, customer]) => ({
        saveForLater: payload.saveForLater,
        paymentInstrument: payload.paymentInstrument,
        customerNo: customer && customer.customerNo,
      })),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([payload, basketid]) => {
        const createPayment$ =
          payload.customerNo && payload.saveForLater
            ? this.paymentService.createUserPayment(payload.customerNo, payload.paymentInstrument)
            : this.paymentService.createBasketPayment(basketid, payload.paymentInstrument);

        return createPayment$.pipe(
          concatMap(pi => [setBasketPayment({ id: pi.id }), createBasketPaymentSuccess()]),
          mapErrorToAction(createBasketPaymentFail)
        );
      })
    )
  );

  /**
   * Checks, if the page is called with redirect query params and sends them to the server ( only RedirectBeforeCheckout)
   */
  sendPaymentRedirectData$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/\/checkout\/(payment|review).*/),
      select(selectQueryParams),
      // don't do anything in case of RedirectAfterCheckout
      filter(({ redirect, orderId }) => redirect && !orderId),
      switchMap(queryParams =>
        this.store.pipe(
          select(getCurrentBasketId),
          whenTruthy(),
          take(1),
          mapTo(updateBasketPayment({ params: queryParams }))
        )
      )
    )
  );

  /**
   * Updates a basket payment concerning redirect data.
   */
  updateBasketPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketPayment),
      mapToPayloadProperty('params'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([params, basketid]) =>
        this.paymentService
          .updateBasketPayment(basketid, params)
          .pipe(mapTo(updateBasketPaymentSuccess()), mapErrorToAction(updateBasketPaymentFail))
      )
    )
  );

  /**
   * Deletes a payment instrument and the related payment at the current basket.
   */
  deleteBasketPaymentInstrument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketPayment),
      mapToPayloadProperty('paymentInstrument'),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      concatMap(([paymentInstrument, basket]) =>
        this.paymentService
          .deleteBasketPaymentInstrument(basket, paymentInstrument)
          .pipe(mapTo(deleteBasketPaymentSuccess()), mapErrorToAction(deleteBasketPaymentFail))
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  loadBasketAfterBasketChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setBasketPaymentSuccess, setBasketPaymentFail, updateBasketPaymentSuccess, deleteBasketPaymentSuccess),
      mapTo(loadBasket())
    )
  );

  /**
   * Triggers a LoadEligiblePaymentMethods action after successful delete a eligible Payment Instrument.
   */
  loadBasketEligiblePaymentMethodsAfterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketPaymentSuccess, createBasketPaymentSuccess),
      mapTo(loadBasketEligiblePaymentMethods())
    )
  );
  /**
   * Update CvcLastUpdated for Concardis Credit Card.
   */
  updateCvcLastUpdated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCvcLastUpdated),
      mapToPayloadProperty('paymentInstrument'),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      concatMap(([paymentInstrument, basket]) =>
        this.paymentService.updateBasketPaymentInstrument(basket, paymentInstrument).pipe(
          map(pi => updateCvcLastUpdatedSuccess({ paymentInstrument: pi })),
          mapErrorToAction(updateCvcLastUpdatedFail)
        )
      )
    )
  );
}
