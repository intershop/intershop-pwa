import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';
import { BasketService } from '../../../services/basket/basket.service';
import { OrderService } from '../../../services/order/order.service';
import { LoadProduct, getProductEntities } from '../../shopping/products';
import { UserActionTypes } from '../../user';

import * as basketActions from './basket.actions';
import { getCurrentBasket } from './basket.selectors';

@Injectable()
export class BasketEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private basketService: BasketService,
    private orderService: OrderService,
    private router: Router
  ) {}

  /**
   * The load basket effect.
   */
  @Effect()
  loadBasket$ = this.actions$.pipe(
    ofType<basketActions.LoadBasket>(basketActions.BasketActionTypes.LoadBasket),
    mapToPayloadProperty('id'),
    mergeMap(id =>
      this.basketService.getBasket(id).pipe(
        map(basket => new basketActions.LoadBasketSuccess({ basket })),
        mapErrorToAction(basketActions.LoadBasketFail)
      )
    )
  );

  /**
   * After successfully loading the basket, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForBasket$ = this.actions$.pipe(
    ofType<basketActions.LoadBasketSuccess>(basketActions.BasketActionTypes.LoadBasketSuccess),
    mapToPayloadProperty('basket'),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    switchMap(([basket, products]) => [
      ...basket.lineItems
        .map(basketItem => basketItem.productSKU)
        .filter(sku => !products[sku])
        .map(sku => new LoadProduct({ sku })),
    ])
  );

  /**
   * The load basket eligible shipping methods effect.
   */
  @Effect()
  loadBasketEligibleShippingMethods$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketEligibleShippingMethods),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([, basket]) =>
      this.basketService.getBasketEligibleShippingMethods(basket.id).pipe(
        map(result => new basketActions.LoadBasketEligibleShippingMethodsSuccess({ shippingMethods: result })),
        mapErrorToAction(basketActions.LoadBasketEligibleShippingMethodsFail)
      )
    )
  );

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
   * Update basket effect.
   */
  @Effect()
  updateBasket$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasket>(basketActions.BasketActionTypes.UpdateBasket),
    mapToPayloadProperty('update'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([update, currentBasket]) =>
      this.basketService.updateBasket(currentBasket.id, update).pipe(
        map(basket => new basketActions.LoadBasketSuccess({ basket })),
        mapErrorToAction(basketActions.UpdateBasketFail)
      )
    )
  );

  /**
   * Updates the common shipping method of the basket.
   * Works currently only if the basket has one bucket
   */
  @Effect()
  updateBasketShippingMethod$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketShippingMethod>(basketActions.BasketActionTypes.UpdateBasketShippingMethod),
    mapToPayloadProperty('shippingId'),
    map(commonShippingMethod => new basketActions.UpdateBasket({ update: { commonShippingMethod } }))
  );

  /**
   * Sets a payment at the current basket.
   */
  @Effect()
  setPaymentAtBasket$ = this.actions$.pipe(
    ofType<basketActions.SetBasketPayment>(basketActions.BasketActionTypes.SetBasketPayment),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([paymentInstrument, basket]) =>
      this.basketService.setBasketPayment(basket.id, paymentInstrument).pipe(
        mapTo(new basketActions.SetBasketPaymentSuccess()),
        mapErrorToAction(basketActions.SetBasketPaymentFail)
      )
    )
  );

  /**
   * Add quote to the current basket.
   * Only triggers if the user has a basket.
   */
  @Effect()
  addQuoteToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddQuoteToBasket>(basketActions.BasketActionTypes.AddQuoteToBasket),
    mapToPayloadProperty('quoteId'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([, basket]) => !!basket && !!basket.id),
    concatMap(([quoteId, basket]) =>
      this.basketService.addQuoteToBasket(quoteId, basket.id).pipe(
        map(link => new basketActions.AddQuoteToBasketSuccess({ link })),
        mapErrorToAction(basketActions.AddQuoteToBasketFail)
      )
    )
  );

  /**
   * Get current basket if missing and call AddQuoteToBasketAction
   * Only triggers if the user has not yet a basket
   */
  @Effect()
  getBasketBeforeAddQuoteToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddQuoteToBasket>(basketActions.BasketActionTypes.AddQuoteToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([, basket]) => !basket || !basket.id),
    mergeMap(([payload]) => forkJoin(of(payload), this.basketService.createBasket())),
    map(([payload]) => new basketActions.AddQuoteToBasket(payload))
  );

  /**
   * Triggers a Caluculate Basket action after adding a quote to basket.
   * ToDo: This is only necessary as long as api v0 is used for addQuote and addPayment
   */
  @Effect()
  calculateBasketAfterAddToQuote = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.AddQuoteToBasketSuccess,
      basketActions.BasketActionTypes.AddQuoteToBasketFail
    ),
    mapTo(new basketActions.UpdateBasket({ update: { calculationState: 'CALCULATED' } }))
  );

  /**
   * Trigger an AddItemsToBasket action after LoginUserSuccess, if basket items are present from pre login state.
   */
  @Effect()
  mergeBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([, currentBasket]) => currentBasket && currentBasket.lineItems && currentBasket.lineItems.length > 0),
    switchMap(() => this.basketService.getBaskets()),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    tap(() => this.store.dispatch(new basketActions.ResetBasket())),
    map(([newBaskets, currentBasket]) => {
      const items = currentBasket.lineItems.map(lineItem => ({
        sku: lineItem.productSKU,
        quantity: lineItem.quantity.value,
      }));

      return new basketActions.AddItemsToBasket({ items, basketId: newBaskets.length ? newBaskets[0].id : undefined });
    })
  );

  /**
   * Trigger LoadBasket action after LoginUserSucces, if no pre login state basket items are present.
   */
  @Effect()
  loadBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() => this.basketService.getBaskets()) /* prevent 404 error by checking on existing basket */,
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(
      ([newBaskets, currentBasket]) =>
        (!currentBasket || !currentBasket.lineItems || currentBasket.lineItems.length === 0) && newBaskets.length > 0
    ),
    mapTo(new basketActions.LoadBasket())
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketChangeSuccess$ = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.SetBasketPaymentSuccess,
      basketActions.BasketActionTypes.SetBasketPaymentFail
    ),
    mapTo(new basketActions.LoadBasket())
  );

  /**
   * Trigger ResetBasket action after LogoutUser.
   */
  @Effect()
  resetBasketAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),

    mapTo(new basketActions.ResetBasket())
  );

  /**
   * Creates an order based on the given basket.
   */
  @Effect()
  createOrder$ = this.actions$.pipe(
    ofType<basketActions.CreateOrder>(basketActions.BasketActionTypes.CreateOrder),
    mapToPayloadProperty('basket'),
    mergeMap(basket =>
      this.orderService.createOrder(basket, true).pipe(
        map(order => new basketActions.CreateOrderSuccess({ order })),
        mapErrorToAction(basketActions.CreateOrderFail)
      )
    )
  );

  @Effect({ dispatch: false })
  goToCheckoutReceiptPageAfterOrderCreation$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.CreateOrderSuccess),
    tap(() => this.router.navigate(['/checkout/receipt']))
  );
}
