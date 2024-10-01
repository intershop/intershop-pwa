import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { EMPTY, from, merge, race } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { OrderService } from 'ish-core/services/order/order.service';
import { ofUrl, selectQueryParam, selectQueryParams, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { continueCheckoutWithIssues, getCurrentBasketId, loadBasket } from 'ish-core/store/customer/basket';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  createOrder,
  createOrderFail,
  createOrderSuccess,
  loadMoreOrders,
  loadOrder,
  loadOrderByAPIToken,
  loadOrderFail,
  loadOrderSuccess,
  loadOrders,
  loadOrdersFail,
  loadOrdersSuccess,
  selectOrder,
  selectOrderAfterRedirect,
  selectOrderAfterRedirectFail,
} from './orders.actions';
import { getOrder, getOrderListQuery, getSelectedOrder } from './orders.selectors';

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
  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrder),
      concatLatestFrom(() => this.store.pipe(select(getCurrentBasketId))),
      mergeMap(([, basketId]) =>
        this.orderService.createOrder(basketId, true).pipe(
          map(order => createOrderSuccess({ order, basketId })),
          mapErrorToAction(createOrderFail)
        )
      )
    )
  );

  /**
   * After order creation either redirect to a payment provider or show checkout receipt page.
   */
  continueAfterOrderCreation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderSuccess),
        mapToPayload(),
        filter(({ order }) => !order?.orderCreation || order.orderCreation.status !== 'ROLLED_BACK'),
        concatMap(({ order, basketId }) => {
          if (
            order.orderCreation &&
            order.orderCreation.status === 'STOPPED' &&
            order.orderCreation.stopAction.type === 'Redirect' &&
            order.orderCreation.stopAction.redirectUrl
          ) {
            location.assign(order.orderCreation.stopAction.redirectUrl);
            return EMPTY;
          } else if (
            order.orderCreation?.status === 'STOPPED' &&
            order.orderCreation.stopAction.exitReason === 'recurring.order'
          ) {
            return from(this.router.navigate(['/checkout/receipt'], { queryParams: { recurringOrderId: basketId } }));
          } else {
            return from(this.router.navigate(['/checkout/receipt'], { queryParams: { orderId: order.id } }));
          }
        })
      ),
    { dispatch: false }
  );

  rollbackAfterOrderCreation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderSuccess),
      mapToPayloadProperty('order'),
      filter(order => order.orderCreation && order.orderCreation.status === 'ROLLED_BACK'),
      concatMap(order =>
        from(this.router.navigate(['/checkout/payment'], { queryParams: { error: true } })).pipe(
          mergeMap(() => [
            loadBasket(),
            continueCheckoutWithIssues({
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
        )
      )
    )
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrders),
      mapToPayloadProperty('query'),
      switchMap(query =>
        this.orderService.getOrders(query).pipe(
          map(orders => loadOrdersSuccess({ orders, query, allRetrieved: orders.length < query.limit })),
          mapErrorToAction(loadOrdersFail)
        )
      )
    )
  );

  loadMoreOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreOrders),
      concatLatestFrom(() => this.store.pipe(select(getOrderListQuery))),
      map(([, query]) => loadOrders({ query: { ...query, offset: (query.offset ?? 0) + query.limit } }))
    )
  );

  loadOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrder),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.orderService.getOrder(orderId).pipe(
          map(order => loadOrderSuccess({ order })),
          mapErrorToAction(loadOrderFail)
        )
      )
    )
  );

  /**
   * Loads an anonymous user`s order using the given api token and orderId.
   */
  loadOrderByAPIToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderByAPIToken),
      mapToPayload(),
      concatMap(payload =>
        this.orderService.getOrderByToken(payload.orderId, payload.apiToken).pipe(
          map(order => loadOrderSuccess({ order })),
          mapErrorToAction(loadOrderFail)
        )
      )
    )
  );

  /**
   * Selects and loads an order.
   */
  loadOrderForSelectedOrder$ =
    !SSR &&
    createEffect(() =>
      this.actions$.pipe(
        ofType(selectOrder),
        mapToPayloadProperty('orderId'),
        whenTruthy(),
        map(orderId => loadOrder({ orderId }))
      )
    );

  /**
   * Triggers a SelectOrder action if route contains orderId query or route parameter.
   */
  routeListenerForSelectingOrder$ = createEffect(() =>
    merge(
      this.store.pipe(ofUrl(/^\/account\/orders.*/), select(selectRouteParam('orderId'))),
      this.store.pipe(ofUrl(/^\/checkout\/receipt/), select(selectQueryParam('orderId')))
    ).pipe(map(orderId => selectOrder({ orderId })))
  );

  /**
   * Returning from redirect after checkout (before customer is logged in).
   * Waits until the customer is logged in and triggers the handleOrderAfterRedirect action afterwards.
   */
  returnFromRedirectAfterOrderCreation$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/checkout\/(receipt|payment)/),
      select(selectQueryParams),
      filter(({ redirect, orderId }) => redirect && orderId),
      distinctUntilChanged(isEqual),
      switchMap(queryParams =>
        // SelectOrderAfterRedirect will be triggered either after a user is logged in or after the paid order is loaded (anonymous user)
        race([
          this.store.pipe(select(getLoggedInUser), whenTruthy(), take(1)),
          this.store.pipe(select(getOrder(queryParams.orderId)), whenTruthy(), take(1)),
        ]).pipe(map(() => selectOrderAfterRedirect({ params: queryParams })))
      )
    )
  );

  /**
   * Returning from redirect after checkout success case (after customer is logged in).
   * Sends success state with payment query params to the server and selects/loads order.
   */
  selectOrderAfterRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectOrderAfterRedirect),
      mapToPayloadProperty('params'),
      concatMap(params =>
        this.orderService.updateOrderPayment(params.orderId, params).pipe(
          map(orderId => {
            if (params.redirect === 'success') {
              return selectOrder({ orderId });
            } else {
              // cancelled payment
              return loadBasket();
            }
          }),
          mapErrorToAction(selectOrderAfterRedirectFail)
        )
      )
    )
  );

  setOrderBreadcrumb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMap(() =>
        this.store.pipe(
          ofUrl(/^\/account\/orders\/.*/),
          select(getSelectedOrder),
          whenTruthy(),
          map(order =>
            setBreadcrumbData({
              breadcrumbData: [
                { key: 'account.order_history.link', link: '/account/orders' },
                { text: `${this.translateService.instant('account.orderdetails.breadcrumb')} - ${order.documentNo}` },
              ],
            })
          )
        )
      )
    )
  );
}
