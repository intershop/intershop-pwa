import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, switchMap, take } from 'rxjs/operators';

import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentPaypalService } from 'ish-core/services/payment-paypal/payment-paypal.service';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { mapToRouterState } from 'ish-core/store/core/router';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';

import {
  continueCheckout,
  continueWithFastCheckout,
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  createPaypalCreditCardBasketPayment,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  deletePaypalCreditCardBasketPayment,
  emitPaypalOrderId,
  loadBasket,
  loadBasketEligiblePaymentMethods,
  loadBasketEligiblePaymentMethodsFail,
  loadBasketEligiblePaymentMethodsSuccess,
  loadPaypalToken,
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
  updatePaymentInstrument,
  updatePaymentInstrumentFail,
  updatePaymentInstrumentSuccess,
  updatePaypalCreditCardPaymentInstrument,
} from './basket.actions';
import { getCurrentBasket } from './basket.selectors';

@Injectable()
export class BasketPaymentEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private paymentService: PaymentService,
    private paymentPaypalService: PaymentPaypalService,
    private paypalDataTransferService: PaypalDataTransferService
  ) {}

  /**
   * The load basket eligible payment methods effect.
   */
  loadBasketEligiblePaymentMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketEligiblePaymentMethods),
      exhaustMap(() =>
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
      concatMap(id =>
        this.paymentService.setBasketPayment(id).pipe(
          map(() => setBasketPaymentSuccess()),
          mapErrorToAction(setBasketPaymentFail)
        )
      )
    )
  );

  loadPaypalToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPaypalToken),
      mapToPayloadProperty('paymentInstrumentId'),
      concatMap(paymentInstrumentId =>
        this.paymentPaypalService.getPaypalToken(paymentInstrumentId).pipe(
          concatMap(token => [setBasketPaymentSuccess(), emitPaypalOrderId({ orderId: token, paymentInstrumentId })]),
          // In case of an error during token retrieval, the information must passed to the adapter
          // to handle this error in the correct way e.g close the overlay.
          catchError(() => [emitPaypalOrderId({ orderId: undefined, paymentInstrumentId })])
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
   * For Paypal credit card it is necessary to create a temporary payment instrument. Means the payment instrument is not transferred to the ngrx store.
   * Otherwise the paypal iframe us not working correctly because change detection is triggered.
   */
  createPaypalCreditCardBasketPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createPaypalCreditCardBasketPayment),
      mapToPayload(),
      concatMap(payload =>
        this.paymentPaypalService.initializePaypalExperienceContextFlow(payload.paymentInstrument).pipe(
          map(response =>
            emitPaypalOrderId({ orderId: response.orderId, paymentInstrumentId: response.paymentInstrumentId })
          ),
          mapErrorToAction(setBasketPaymentFail)
        )
      )
    )
  );

  /**
   * Transfer PayPal order data after successful order ID retrieval.
   */
  emitPaypalOrderData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(emitPaypalOrderId),
        mapToPayload(),
        concatMap(payload => {
          this.paypalDataTransferService.emitPaypalOrderData({
            orderId: payload.orderId,
            paymentInstrumentId: payload.paymentInstrumentId,
          });
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  /**
   * Deletes the temporary PayPal payment instrument. If an error message is provided,
   * emits setBasketPaymentFail action. Otherwise, no action is dispatched.
   */
  deletePaypalCreditCardBasketPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePaypalCreditCardBasketPayment),
      mapToPayload(),
      concatLatestFrom(() => this.store.pipe(select(getCurrentBasket))),
      concatMap(([payload, basket]) =>
        this.paymentService.deleteBasketPaymentInstrument(basket, payload.paymentInstrument).pipe(
          concatMap(() =>
            payload.errorMessage
              ? of(setBasketPaymentFail({ error: { name: 'HttpErrorResponse', message: payload.errorMessage } }))
              : EMPTY
          ),
          mapErrorToAction(setBasketPaymentFail)
        )
      )
    )
  );

  /**
   * Submits PayPal payment instrument data after approval and updates the payment instrument in the store.
   */
  submitPaypalPaymentInstrumentDataAfterApproval$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePaypalCreditCardPaymentInstrument),
      mapToPayload(),
      concatMap(payload =>
        this.paymentPaypalService.getPaypalPaymentInstrument(payload.paymentInstrument).pipe(
          concatMap(response => {
            if ('errorMessage' in response && response.errorMessage) {
              return [
                deletePaypalCreditCardBasketPayment({
                  paymentInstrument: payload.paymentInstrument,
                  errorMessage: response.errorMessage,
                }),
              ];
            }
            return [
              updatePaymentInstrument({ paymentInstrument: response as PaymentInstrument }),
              continueCheckout({ targetStep: CheckoutStepType.Review }),
            ];
          }),
          mapErrorToAction(setBasketPaymentFail)
        )
      )
    )
  );

  updatePaymentInstrument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePaymentInstrument),
      mapToPayload(),
      concatMap(payload =>
        this.paymentService.updatePaymentInstrument(payload.paymentInstrument).pipe(
          concatMap(() => [updatePaymentInstrumentSuccess(), loadBasketEligiblePaymentMethods()]),
          mapErrorToAction(updatePaymentInstrumentFail)
        )
      )
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
          select(getCurrentBasket),
          whenTruthy(),
          take(1),
          filter(basket => !!basket.payment?.capabilities?.includes('PaypalCheckout')),
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
      ofType(
        setBasketPaymentSuccess,
        setBasketPaymentFail,
        updateBasketPaymentSuccess,
        updatePaymentInstrumentSuccess,
        deleteBasketPaymentSuccess
      ),
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
