import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { race } from 'rxjs';
import {
  concatMap,
  debounceTime,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { OrderService } from 'ish-core/services/order/order.service';
import { ContinueCheckoutWithIssues, LoadBasket } from 'ish-core/store/account/basket';
import { getLoggedInUser } from 'ish-core/store/account/user';
import { ofUrl, selectQueryParams, selectRouteParam } from 'ish-core/store/core/router';
import { SetBreadcrumbData } from 'ish-core/store/core/viewconf';
import { LoadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  CreateOrder,
  CreateOrderFail,
  CreateOrderSuccess,
  LoadOrder,
  LoadOrderByAPIToken,
  LoadOrderFail,
  LoadOrderSuccess,
  LoadOrdersFail,
  LoadOrdersSuccess,
  OrdersActionTypes,
  SelectOrder,
  SelectOrderAfterRedirect,
  SelectOrderAfterRedirectFail,
} from './orders.actions';
import { getOrder, getSelectedOrder, getSelectedOrderId } from './orders.selectors';

@Injectable()
export class OrdersEffects {
  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private router: Router,
    private store: Store,
    private translateService: TranslateService
  ) {}

  /**
   * Creates an order based on the given basket.
   */
  @Effect()
  createOrder$ = this.actions$.pipe(
    ofType<CreateOrder>(OrdersActionTypes.CreateOrder),
    mapToPayloadProperty('basketId'),
    mergeMap(basketId =>
      this.orderService.createOrder(basketId, true).pipe(
        map(order => new CreateOrderSuccess({ order })),
        mapErrorToAction(CreateOrderFail)
      )
    )
  );

  /**
   * After order creation either redirect to a payment provider or show checkout receipt page.
   */
  @Effect({ dispatch: false })
  continueAfterOrderCreation$ = this.actions$.pipe(
    ofType(OrdersActionTypes.CreateOrderSuccess),
    mapToPayloadProperty('order'),
    filter(order => !order || !order.orderCreation || order.orderCreation.status !== 'ROLLED_BACK'),
    tap(order => {
      if (
        order.orderCreation &&
        order.orderCreation.status === 'STOPPED' &&
        order.orderCreation.stopAction.type === 'Redirect' &&
        order.orderCreation.stopAction.redirectUrl
      ) {
        location.assign(order.orderCreation.stopAction.redirectUrl);
      } else {
        this.router.navigate(['/checkout/receipt']);
      }
    })
  );

  @Effect()
  rollbackAfterOrderCreation$ = this.actions$.pipe(
    ofType(OrdersActionTypes.CreateOrderSuccess),
    mapToPayloadProperty('order'),
    filter(order => order.orderCreation && order.orderCreation.status === 'ROLLED_BACK'),
    tap(() => this.router.navigate(['/checkout/payment'], { queryParams: { error: true } })),
    concatMap(order => [
      new LoadBasket(),
      new ContinueCheckoutWithIssues({
        targetRoute: undefined,
        basketValidation: {
          basket: undefined,
          results: {
            valid: false,
            adjusted: false,
            errors: order.infos,
          },
        },
      }),
    ])
  );

  @Effect()
  loadOrders$ = this.actions$.pipe(
    ofType(OrdersActionTypes.LoadOrders),
    concatMap(() =>
      this.orderService.getOrders().pipe(
        map(orders => new LoadOrdersSuccess({ orders })),
        mapErrorToAction(LoadOrdersFail)
      )
    )
  );

  @Effect()
  loadOrder$ = this.actions$.pipe(
    ofType(OrdersActionTypes.LoadOrder),
    mapToPayloadProperty('orderId'),
    concatMap(orderId =>
      this.orderService.getOrder(orderId).pipe(
        map(order => new LoadOrderSuccess({ order })),
        mapErrorToAction(LoadOrderFail)
      )
    )
  );

  /**
   * Loads an anonymous user`s order using the given api token and orderId.
   */
  @Effect()
  loadOrderByAPIToken$ = this.actions$.pipe(
    ofType<LoadOrderByAPIToken>(OrdersActionTypes.LoadOrderByAPIToken),
    mapToPayload(),
    concatMap(payload =>
      this.orderService.getOrderByToken(payload.orderId, payload.apiToken).pipe(
        map(order => new LoadOrderSuccess({ order })),
        mapErrorToAction(LoadOrderFail)
      )
    )
  );

  /**
   * Selects and loads an order.
   */
  @Effect()
  loadOrderForSelectedOrder$ = this.actions$.pipe(
    ofType<SelectOrder>(OrdersActionTypes.SelectOrder),
    mapToPayloadProperty('orderId'),
    whenTruthy(),
    map(orderId => new LoadOrder({ orderId }))
  );

  /**
   * Triggers a SelectOrder action if route contains orderId parameter ( for order detail page ).
   */
  @Effect()
  routeListenerForSelectingOrder$ = this.store.pipe(
    ofUrl(/^\/(account\/orders.*|checkout\/receipt)/),
    select(selectRouteParam('orderId')),
    withLatestFrom(this.store.pipe(select(getSelectedOrderId))),
    filter(([fromAction, selectedOrderId]) => fromAction && fromAction !== selectedOrderId),
    map(([orderId]) => new SelectOrder({ orderId }))
  );

  /**
   * After selecting and successfully loading an order, triggers a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForSelectedOrder$ = this.actions$.pipe(
    ofType<LoadOrderSuccess>(OrdersActionTypes.LoadOrderSuccess),
    mapToPayloadProperty('order'),
    switchMap(order => [
      ...order.lineItems.map(
        ({ productSKU }) => new LoadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
      ),
    ])
  );

  /**
   * Returning from redirect after checkout (before customer is logged in).
   * Waits until the customer is logged in and triggers the handleOrderAfterRedirect action afterwards.
   */
  @Effect()
  returnFromRedirectAfterOrderCreation$ = this.store.pipe(
    ofUrl(/^\/checkout\/(receipt|payment)/),
    select(selectQueryParams),
    filter(({ redirect, orderId }) => redirect && orderId),
    switchMap(queryParams =>
      // SelectOrderAfterRedirect will be triggered either after a user is logged in or after the paid order is loaded (anonymous user)
      race([
        this.store.pipe(select(getLoggedInUser), whenTruthy(), take(1)),
        this.store.pipe(select(getOrder, { orderId: queryParams.orderId }), whenTruthy(), take(1)),
      ]).pipe(mapTo(new SelectOrderAfterRedirect({ params: queryParams })))
    )
  );

  /**
   * Returning from redirect after checkout success case (after customer is logged in).
   * Sends success state with payment query params to the server and selects/loads order.
   */
  @Effect()
  selectOrderAfterRedirect$ = this.actions$.pipe(
    ofType(OrdersActionTypes.SelectOrderAfterRedirect),
    mapToPayloadProperty('params'),
    concatMap(params =>
      this.orderService.updateOrderPayment(params.orderId, params).pipe(
        map(orderId => {
          if (params.redirect === 'success') {
            return new SelectOrder({ orderId });
          } else {
            return new LoadBasket();
          }
        }),
        mapErrorToAction(SelectOrderAfterRedirectFail) // ToDo: display error message on receipt page
      )
    )
  );

  @Effect()
  selectOrderAfterRedirectFailed$ = this.actions$.pipe(
    ofType(OrdersActionTypes.SelectOrderAfterRedirectFail),
    tap(() =>
      this.router.navigate(['/checkout/payment'], {
        queryParams: { redirect: 'failure' },
      })
    ),
    mapTo(new LoadBasket())
  );

  @Effect()
  setOrderBreadcrumb$ = this.store.pipe(
    select(getSelectedOrder),
    whenTruthy(),
    debounceTime(0),
    withLatestFrom(this.translateService.get('account.orderdetails.breadcrumb')),
    map(
      ([order, x]) =>
        new SetBreadcrumbData({
          breadcrumbData: [
            { key: 'account.order_history.link', link: '/account/orders' },
            { text: `${x} - ${order.documentNo}` },
          ],
        })
    )
  );
}
