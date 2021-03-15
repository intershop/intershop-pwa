import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { PaymentService } from 'ish-core/services/payment/payment.service';
import { mapToRouterState } from 'ish-core/store/core/router';
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
  updateConcardisCvcLastUpdated,
  updateConcardisCvcLastUpdatedFail,
  updateConcardisCvcLastUpdatedSuccess,
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
      concatMap(() =>
        this.paymentService.getBasketEligiblePaymentMethods().pipe(
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
      concatMap(paymentInstrumentId =>
        this.paymentService
          .setBasketPayment(paymentInstrumentId)
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
      concatMap(payload => {
        const createPayment$ =
          payload.customerNo && payload.saveForLater
            ? this.paymentService.createUserPayment(payload.customerNo, payload.paymentInstrument)
            : this.paymentService.createBasketPayment(payload.paymentInstrument);

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
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToRouterState(),
      // don't do anything in case of RedirectAfterCheckout
      filter(
        routerState =>
          /\/checkout\/(payment|review).*/.test(routerState.url) &&
          routerState.queryParams.redirect &&
          !routerState.queryParams.orderId
      ),
      switchMap(routerState =>
        this.store.pipe(
          select(getCurrentBasketId),
          whenTruthy(),
          take(1),
          mapTo(updateBasketPayment({ params: routerState.queryParams }))
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
      concatMap(params =>
        this.paymentService
          .updateBasketPayment(params)
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
  updateConcardisCvcLastUpdated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateConcardisCvcLastUpdated),
      mapToPayloadProperty('paymentInstrument'),
      concatMap(paymentInstrument =>
        this.paymentService.updateConcardisCvcLastUpdated(paymentInstrument).pipe(
          map(pi => updateConcardisCvcLastUpdatedSuccess({ paymentInstrument: pi })),
          mapErrorToAction(updateConcardisCvcLastUpdatedFail)
        )
      )
    )
  );
}
