import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { concatMap, filter, map, switchMap, take } from 'rxjs/operators';

import { PaymentService } from 'ish-core/services/payment/payment.service';
import { mapToRouterState } from 'ish-core/store/core/router';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  continueWithFastCheckout,
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
  startRedirectBeforeCheckout,
  startRedirectBeforeCheckoutFail,
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
      switchMap(() =>
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
        this.paymentService.setBasketPayment(paymentInstrumentId).pipe(
          map(() => setBasketPaymentSuccess()),
          mapErrorToAction(setBasketPaymentFail)
        )
      )
    )
  );

  startRedirectBeforeCheckout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startRedirectBeforeCheckout),
      concatLatestFrom(() => this.store.pipe(select(getCurrentBasket))),
      map(([, basket]) => basket?.payment?.paymentInstrument.id),
      concatMap(paymentInstrumentId =>
        this.paymentService.sendRedirectUrls(paymentInstrumentId).pipe(
          concatMap(paymentData => {
            location.assign(paymentData?.redirect?.redirectUrl);
            return EMPTY;
          }),
          mapErrorToAction(startRedirectBeforeCheckoutFail)
        )
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
      concatLatestFrom(() => this.store.pipe(select(getLoggedInCustomer))),
      map(([payload, customer]) => ({
        saveForLater: payload.saveForLater,
        paymentInstrument: payload.paymentInstrument,
        customerNo: customer?.customerNo,
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
          map(() => updateBasketPayment({ params: routerState.queryParams }))
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
        this.paymentService.updateBasketPayment(params).pipe(
          map(() => updateBasketPaymentSuccess()),
          mapErrorToAction(updateBasketPaymentFail)
        )
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
      concatLatestFrom(() => this.store.pipe(select(getCurrentBasket))),
      concatMap(([paymentInstrument, basket]) =>
        this.paymentService.deleteBasketPaymentInstrument(basket, paymentInstrument).pipe(
          map(() => deleteBasketPaymentSuccess()),
          mapErrorToAction(deleteBasketPaymentFail)
        )
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  loadBasketAfterBasketChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setBasketPaymentSuccess, setBasketPaymentFail, updateBasketPaymentSuccess, deleteBasketPaymentSuccess),
      map(() => loadBasket())
    )
  );

  /**
   * Triggers a LoadEligiblePaymentMethods action after successful delete a eligible Payment Instrument.
   */
  loadBasketEligiblePaymentMethodsAfterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketPaymentSuccess, createBasketPaymentSuccess),
      map(() => loadBasketEligiblePaymentMethods())
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

  /**
   * The redirect fast checkout payment method effect.
   */
  continueWithFastCheckout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(continueWithFastCheckout),
        mapToPayloadProperty('paymentId'),
        switchMap(paymentInstrumentId =>
          this.paymentService.setBasketFastCheckoutPayment(paymentInstrumentId).pipe(
            concatMap(redirectUrl => {
              location.assign(redirectUrl);
              return EMPTY;
            }),
            mapErrorToAction(setBasketPaymentFail)
          )
        )
      ),
    { dispatch: false }
  );
}
