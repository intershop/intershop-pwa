import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE, RouteNavigation } from 'ngrx-router';
import { combineLatest } from 'rxjs';
import { concatMap, filter, map, mapTo, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction } from 'ish-core/utils/operators';
import { OrderService } from '../../services/order/order.service';
import { LoadProduct, getProductEntities } from '../shopping/products';
import { UserActionTypes } from '../user';

import * as ordersActions from './orders.actions';
import { getSelectedOrderId } from './orders.selectors';

@Injectable()
export class OrdersEffects {
  constructor(private actions$: Actions, private orderService: OrderService, private store: Store<{}>) {}

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

  /**
   * Triggers a SelectOrderRequest action if route contains orderId parameter
   */
  @Effect()
  routeListenerForSelectingOrder$ = this.actions$.pipe(
    ofType<RouteNavigation>(ROUTER_NAVIGATION_TYPE),
    map(action => action.payload.params.orderId),
    withLatestFrom(this.store.pipe(select(getSelectedOrderId))),
    filter(([fromAction, selectedOrderId]) => fromAction && fromAction !== selectedOrderId),
    map(([orderId]) => new ordersActions.SelectOrder({ orderId }))
  );

  @Effect()
  loadOrdersForSelectedOrder$ = this.actions$.pipe(
    ofType<ordersActions.SelectOrder>(ordersActions.OrdersActionTypes.SelectOrder),
    map(action => action.payload),
    filter(orderId => !!orderId),
    map(() => new ordersActions.LoadOrders())
  );

  /**
   * After selecting and successfully loading an order, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForSelectedOrder$ = combineLatest(
    this.actions$.pipe(
      ofType<ordersActions.SelectOrder>(ordersActions.OrdersActionTypes.SelectOrder),
      map(action => action.payload.orderId)
    ),
    this.actions$.pipe(
      ofType<ordersActions.LoadOrdersSuccess>(ordersActions.OrdersActionTypes.LoadOrdersSuccess),
      map(action => action.payload.orders)
    )
  ).pipe(
    map(([orderId, orders]) => orders.filter(order => order.id === orderId).pop()),
    filter(order => !!order),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    concatMap(([order, products]) => [
      ...order.lineItems
        .filter(lineItem => !products[lineItem.productSKU])
        .map(lineItem => lineItem.productSKU)
        .map(sku => new LoadProduct({ sku })),
    ])
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
