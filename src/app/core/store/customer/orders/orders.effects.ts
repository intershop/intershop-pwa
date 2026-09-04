import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { EMPTY, from, fromEvent, merge, race } from 'rxjs';
import { catchError, concatMap, distinctUntilChanged, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { Order } from 'ish-core/models/order/order.model';
import { OrderService } from 'ish-core/services/order/order.service';
import { ofUrl, selectQueryParam, selectQueryParams, selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import {
  continueCheckoutWithIssues,
  emitPaypalOrderId,
  getCurrentBasketId,
  loadBasket,
} from 'ish-core/store/customer/basket';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  cancelPaypalOrderCreation,
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
  processPaypalOrderCreation,
  resetAfterCheckoutPaymentRedirectMarker,
  selectOrder,
  selectOrderAfterRedirect,
  selectOrderAfterRedirectFail,
} from './orders.actions';
import { getOrder, getOrderListQuery, getSelectedOrder } from './orders.selectors';

export const REDIRECT_PENDING_ORDER_ID = 'redirect-pending-order-id';

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
        filter(({ order }) => order?.orderCreation?.status !== 'ROLLED_BACK'),
        concatMap(({ order, basketId }) => {
          if (
            order.orderCreation?.status === 'STOPPED' &&
            order.orderCreation.stopAction.type === 'Redirect' &&
            order.orderCreation.stopAction.redirectUrl
          ) {
            sessionStorage.setItem(REDIRECT_PENDING_ORDER_ID, order.id);
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
      filter(order => order.orderCreation?.status === 'ROLLED_BACK'),
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
          map(orders => loadOrdersSuccess({ orders: orders.orders, query, paging: orders.paging })),
          mapErrorToAction(loadOrdersFail)
        )
      )
    )
  );

  loadMoreOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreOrders),
      mapToPayload(),
      concatLatestFrom(() => this.store.pipe(select(getOrderListQuery))),
      map(([payload, query]) => loadOrders({ query: { ...query, offset: payload.offset, limit: payload.limit } }))
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
   * Reloads the application if the checkout review page is restored from the back/forward cache while a
   * payment provider redirect is still pending.
   *
   * Going back from the payment provider shortly after the redirect restores the previous document instead of
   * loading it again. The application is therefore never bootstrapped, no routing happens and
   * cancelOrderAfterRedirectAbortion$ would not notice the return at all.
   *
   * Whether a document is taken from the back/forward cache is browser specific, so the restore is only
   * detectable via the 'persisted' flag of the pageshow event. To bypass the cache exclusively for the
   * aborted redirect, the reload additionally requires the pending order marker and the review page url,
   * which has to be read from the store since the restored document does not trigger a navigation.
   */
  reloadAfterRedirectAbortion$ =
    !SSR &&
    createEffect(
      () =>
        fromEvent<PageTransitionEvent>(window, 'pageshow').pipe(
          filter(event => event.persisted && !!sessionStorage.getItem(REDIRECT_PENDING_ORDER_ID)),
          concatLatestFrom(() => this.store.pipe(select(selectUrl))),
          filter(([, url]) => /^\/checkout\/review/.test(url)),
          map(() => location.reload())
        ),
      { dispatch: false }
    );

  /**
   * Cancels an order whose payment provider redirect has been aborted by the customer.
   *
   * After order creation the customer is redirected to the payment provider by leaving the application.
   * If the customer uses the browser back button there instead of finishing or cancelling the payment,
   * the provider never calls one of the supplied redirect URLs, so the order would stay in its pending
   * 'STOPPED' state and the basket would remain blocked.
   *
   * Returning to the checkout review page without the 'redirect' and 'orderId' query parameters is therefore
   * treated as an abortion: the id of the pending order is read from the session storage and the regular
   * cancellation flow is entered by navigating to the cancel URL, which finally sends the CANCEL status to
   * the server.
   * Since the basket only reappears with that cancellation, the navigation cannot wait for it and may be
   * rejected by the checkout guard, so the marker is kept until the navigation actually succeeded.
   */
  cancelOrderAfterRedirectAbortion$ = createEffect(
    () =>
      this.store.pipe(
        ofUrl(/^\/checkout\/review/),
        select(selectQueryParams),
        // the redirect/orderId parameters mean the provider redirected back on its own, which the regular flow handles
        filter(
          queryParams =>
            !queryParams.redirect && !queryParams.orderId && !!sessionStorage.getItem(REDIRECT_PENDING_ORDER_ID)
        ),
        map(() => sessionStorage.getItem(REDIRECT_PENDING_ORDER_ID)),
        whenTruthy(),
        // prevents a retry loop if the navigation below is rejected by the checkout guard
        distinctUntilChanged(),
        concatMap(orderId =>
          from(this.router.navigate(['/checkout/payment'], { queryParams: { redirect: 'cancel', orderId } }))
        )
      ),
    { dispatch: false }
  );

  /**
   * Removes the pending order marker once a basket is available again.
   *
   * The marker is only consumed when the customer actually returns from the payment provider. If the redirect
   * never takes place or the flow ends somewhere else, the marker would survive in the session storage and let
   * cancelOrderAfterRedirectAbortion$ or reloadAfterRedirectAbortion$ act on an order that is no longer pending.
   *
   * A successfully loaded basket proves that no order blocks the checkout anymore, so it is the earliest point
   * at which the marker can be dropped without cutting off the cancellation retry of a still pending order.
   */
  cleanupRedirectMarker$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetAfterCheckoutPaymentRedirectMarker),
        map(() => sessionStorage.removeItem(REDIRECT_PENDING_ORDER_ID))
      ),
    { dispatch: false }
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

  startPaypalOrderCreation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(processPaypalOrderCreation),
      filter(action => !action.payload.orderId),
      switchMap(() =>
        this.store.pipe(
          select(getCurrentBasketId),
          take(1),
          switchMap(basketId =>
            this.orderService.createOrder(basketId, true).pipe(
              map(order =>
                emitPaypalOrderId({
                  paypalOrderId: this.getPaypalOrderId(order),
                  orderId: order.id,
                })
              ),
              catchError(error => [createOrderFail({ error }), emitPaypalOrderId({ orderStatus: 'ERROR' })])
            )
          )
        )
      )
    )
  );

  continuePaypalOrderCreation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(processPaypalOrderCreation),
      filter(action => !!action.payload.orderId),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.store.pipe(
          select(getCurrentBasketId),
          take(1),
          map(basketId => [orderId, basketId])
        )
      ),
      switchMap(([orderId, basketId]) =>
        this.orderService.continueOrderCreation(orderId).pipe(
          mergeMap(order =>
            order.orderCreation.status === 'ROLLED_BACK'
              ? [
                  cancelPaypalOrderCreation(),
                  emitPaypalOrderId({
                    paypalOrderId: this.getPaypalOrderId(order),
                    orderId: order.id,
                    orderStatus: 'CANCELLED',
                  }),
                ]
              : [
                  createOrderSuccess({ order, basketId }),
                  emitPaypalOrderId({
                    paypalOrderId: this.getPaypalOrderId(order),
                    orderId: order.id,
                    orderStatus: 'SUCCESS',
                  }),
                ]
          ),
          mapErrorToAction(createOrderFail)
        )
      )
    )
  );

  cancelPaypalOrderCreation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(cancelPaypalOrderCreation),
        concatMap(() => from(this.router.navigate(['/checkout/payment'], { queryParams: { redirect: 'cancel' } })))
      ),
    { dispatch: false }
  );

  private getPaypalOrderId(order: Order): string {
    return (
      order.orderCreation?.redirect?.parameters?.find((p: { name: string }) => p.name === 'PayPalOrderID')?.value || ''
    );
  }
}
