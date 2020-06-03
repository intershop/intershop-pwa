import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { PaymentService } from 'ish-core/services/payment/payment.service';
import { getLoggedInCustomer } from 'ish-core/store/account/user';
import { ofUrl, selectQueryParams } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  BasketActionTypes,
  CreateBasketPayment,
  CreateBasketPaymentFail,
  CreateBasketPaymentSuccess,
  DeleteBasketPayment,
  DeleteBasketPaymentFail,
  DeleteBasketPaymentSuccess,
  LoadBasket,
  LoadBasketEligiblePaymentMethods,
  LoadBasketEligiblePaymentMethodsFail,
  LoadBasketEligiblePaymentMethodsSuccess,
  SetBasketPayment,
  SetBasketPaymentFail,
  SetBasketPaymentSuccess,
  UpdateBasketPayment,
  UpdateBasketPaymentFail,
  UpdateBasketPaymentSuccess,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketPaymentEffects {
  constructor(private actions$: Actions, private store: Store, private paymentService: PaymentService) {}

  /**
   * The load basket eligible payment methods effect.
   */
  @Effect()
  loadBasketEligiblePaymentMethods$ = this.actions$.pipe(
    ofType(BasketActionTypes.LoadBasketEligiblePaymentMethods),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([, basketid]) =>
      this.paymentService.getBasketEligiblePaymentMethods(basketid).pipe(
        map(result => new LoadBasketEligiblePaymentMethodsSuccess({ paymentMethods: result })),
        mapErrorToAction(LoadBasketEligiblePaymentMethodsFail)
      )
    )
  );

  /**
   * Sets a payment at the current basket.
   */
  @Effect()
  setPaymentAtBasket$ = this.actions$.pipe(
    ofType<SetBasketPayment>(BasketActionTypes.SetBasketPayment),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([paymentInstrumentId, basketid]) =>
      this.paymentService
        .setBasketPayment(basketid, paymentInstrumentId)
        .pipe(mapTo(new SetBasketPaymentSuccess()), mapErrorToAction(SetBasketPaymentFail))
    )
  );

  /**
   * Creates a payment instrument at the current basket or user respectively - and saves it as payment at basket.
   */
  @Effect()
  createBasketPaymentInstrument$ = this.actions$.pipe(
    ofType<CreateBasketPayment>(BasketActionTypes.CreateBasketPayment),
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
        concatMap(pi => [new SetBasketPayment({ id: pi.id }), new CreateBasketPaymentSuccess()]),
        mapErrorToAction(CreateBasketPaymentFail)
      );
    })
  );

  /**
   * Checks, if the page is called with redirect query params and sends them to the server ( only RedirectBeforeCheckout)
   */
  @Effect()
  sendPaymentRedirectData$ = this.store.pipe(
    ofUrl(/\/checkout\/(payment|review).*/),
    select(selectQueryParams),
    // don't do anything in case of RedirectAfterCheckout
    filter(({ redirect, orderId }) => redirect && !orderId),
    switchMap(queryParams =>
      this.store.pipe(
        select(getCurrentBasketId),
        whenTruthy(),
        take(1),
        mapTo(new UpdateBasketPayment({ params: queryParams }))
      )
    )
  );

  /**
   * Updates a basket payment concerning redirect data.
   */
  @Effect()
  updateBasketPayment$ = this.actions$.pipe(
    ofType<UpdateBasketPayment>(BasketActionTypes.UpdateBasketPayment),
    mapToPayloadProperty('params'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([params, basketid]) =>
      this.paymentService
        .updateBasketPayment(basketid, params)
        .pipe(mapTo(new UpdateBasketPaymentSuccess()), mapErrorToAction(UpdateBasketPaymentFail))
    )
  );

  /**
   * Deletes a payment instrument and the related payment at the current basket.
   */
  @Effect()
  deleteBasketPaymentInstrument$ = this.actions$.pipe(
    ofType<DeleteBasketPayment>(BasketActionTypes.DeleteBasketPayment),
    mapToPayloadProperty('paymentInstrument'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([paymentInstrument, basket]) =>
      this.paymentService
        .deleteBasketPaymentInstrument(basket, paymentInstrument)
        .pipe(mapTo(new DeleteBasketPaymentSuccess()), mapErrorToAction(DeleteBasketPaymentFail))
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketChangeSuccess$ = this.actions$.pipe(
    ofType(
      BasketActionTypes.SetBasketPaymentSuccess,
      BasketActionTypes.SetBasketPaymentFail,
      BasketActionTypes.UpdateBasketPaymentSuccess,
      BasketActionTypes.DeleteBasketPaymentSuccess
    ),
    mapTo(new LoadBasket())
  );

  /**
   * Triggers a LoadEligiblePaymentMethods action after successful delete a eligible Payment Instrument.
   */
  @Effect()
  loadBasketEligiblePaymentMethodsAfterChange$ = this.actions$.pipe(
    ofType(BasketActionTypes.DeleteBasketPaymentSuccess, BasketActionTypes.CreateBasketPaymentSuccess),
    mapTo(new LoadBasketEligiblePaymentMethods())
  );
}
