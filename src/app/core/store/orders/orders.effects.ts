import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { RouteNavigation, mapToParam, ofRoute } from 'ngrx-router';
import { concatMap, filter, map, mapTo, mergeMap, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';
import { OrderService } from '../../services/order/order.service';
import { LoadBasket } from '../checkout/basket';
import { LoadProduct, getProductEntities } from '../shopping/products';
import { UserActionTypes, getLoggedInUser } from '../user';

import * as ordersActions from './orders.actions';
import { getSelectedOrderId } from './orders.selectors';

@Injectable()
export class OrdersEffects {
  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private router: Router,
    private store: Store<{}>
  ) {}

  /**
   * Creates an order based on the given basket.
   */
  @Effect()
  createOrder$ = this.actions$.pipe(
    ofType<ordersActions.CreateOrder>(ordersActions.OrdersActionTypes.CreateOrder),
    mapToPayloadProperty('basket'),
    mergeMap(basket =>
      this.orderService.createOrder(basket, true).pipe(
        map(order => new ordersActions.CreateOrderSuccess({ order })),
        mapErrorToAction(ordersActions.CreateOrderFail)
      )
    )
  );

  /**
   * After order creation either redirect to a payment provider or show checkout receipt page.
   */
  @Effect({ dispatch: false })
  continueAfterOrderCreation$ = this.actions$.pipe(
    ofType(ordersActions.OrdersActionTypes.CreateOrderSuccess),
    mapToPayloadProperty('order'),
    tap(order => {
      if (
        order.orderCreation &&
        order.orderCreation.status === 'STOPPED' &&
        order.orderCreation.stopAction.type === 'Redirect' &&
        order.orderCreation.stopAction.redirectUrl
      ) {
        document.location.assign(order.orderCreation.stopAction.redirectUrl);
      } else {
        this.router.navigate(['/checkout/receipt']);
      }
    })
  );

  @Effect()
  loadOrders$ = this.actions$.pipe(
    ofType(ordersActions.OrdersActionTypes.LoadOrders),
    concatMap(() =>
      this.orderService.getOrders().pipe(
        map(orders => new ordersActions.LoadOrdersSuccess({ orders })),
        mapErrorToAction(ordersActions.LoadOrdersFail)
      )
    )
  );

  @Effect()
  loadOrder$ = this.actions$.pipe(
    ofType(ordersActions.OrdersActionTypes.LoadOrder),
    mapToPayloadProperty('orderId'),
    concatMap(orderId =>
      this.orderService.getOrder(orderId).pipe(
        map(order => new ordersActions.LoadOrderSuccess({ order })),
        mapErrorToAction(ordersActions.LoadOrderFail)
      )
    )
  );

  /**
   * Selects and loads an order.
   */
  @Effect()
  loadOrderForSelectedOrder$ = this.actions$.pipe(
    ofType<ordersActions.SelectOrder>(ordersActions.OrdersActionTypes.SelectOrder),
    mapToPayloadProperty('orderId'),
    whenTruthy(),
    map(orderId => new ordersActions.LoadOrder({ orderId }))
  );

  /**
   * Triggers a SelectOrder action if route contains orderId parameter ( for order detail page ).
   */
  @Effect()
  routeListenerForSelectingOrder$ = this.actions$.pipe(
    ofRoute(),
    mapToParam<string>('orderId'),
    withLatestFrom(this.store.pipe(select(getSelectedOrderId))),
    filter(([fromAction, selectedOrderId]) => fromAction && fromAction !== selectedOrderId),
    map(([orderId]) => new ordersActions.SelectOrder({ orderId }))
  );

  /**
   * After selecting and successfully loading an order, triggers a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForSelectedOrder$ = this.actions$.pipe(
    ofType<ordersActions.LoadOrderSuccess>(ordersActions.OrdersActionTypes.LoadOrderSuccess),
    mapToPayloadProperty('order'),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    switchMap(([order, products]) => [
      ...order.lineItems
        .map(orderItem => orderItem.productSKU)
        .filter(sku => !products[sku])
        .map(sku => new LoadProduct({ sku })),
    ])
  );

  /**
   * Returning from redirect after checkout (before customer is logged in).
   * Waits until the customer is logged in and triggers the handleOrderAfterRedirect action afterwards
   */
  @Effect()
  returnFromRedirectAfterOrderCreation$ = this.actions$.pipe(
    ofRoute(['checkout/receipt', 'checkout/payment']),
    map((action: RouteNavigation) => action.payload.queryParams),
    filter(queryParams => queryParams && queryParams.redirect && queryParams.orderId),
    switchMap(queryParams =>
      this.store.pipe(
        select(getLoggedInUser),
        whenTruthy(),
        take(1),
        mapTo(new ordersActions.SelectOrderAfterRedirect({ params: queryParams }))
      )
    )
  );

  /**
   * Returning from redirect after checkout success case (after customer is logged in).
   * Sends success state with payment query params to the server and selects/loads order.
   */
  @Effect()
  selectOrderAfterRedirect$ = this.actions$.pipe(
    ofType(ordersActions.OrdersActionTypes.SelectOrderAfterRedirect),
    mapToPayloadProperty('params'),
    concatMap(params => {
      if (params.redirect === 'success') {
        return this.orderService.updateOrderPayment(params.orderId, params).pipe(
          map(orderId => new ordersActions.SelectOrder({ orderId })),
          mapErrorToAction(ordersActions.SelectOrderAfterRedirectFail) // ToDo: display error message on receipt page
        );
      } else {
        return this.orderService.updateOrderPayment(params.orderId, params).pipe(
          map(() => new LoadBasket()),
          mapErrorToAction(ordersActions.SelectOrderAfterRedirectFail) // ToDo: display error message on payment page
        );
      }
    })
  );

  /**
   * Trigger ResetOrders action after LogoutUser.
   */
  @Effect()
  resetOrdersAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    mapTo(new ordersActions.ResetOrders())
  );
}
