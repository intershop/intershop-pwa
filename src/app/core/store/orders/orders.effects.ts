import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { concatMap, map, mapTo } from 'rxjs/operators';
import { OrderService } from '../../../account/services/order/order.service';
import { mapErrorToAction } from '../../../utils/operators';
import { UserActionTypes } from '../user';
import * as ordersActions from './orders.actions';

@Injectable()
export class OrdersEffects {
  constructor(private actions$: Actions, private orderService: OrderService) {}

  @Effect()
  loadOrders$ = this.actions$.pipe(
    ofType(ordersActions.OrdersActionTypes.LoadOrders),
    concatMap(() =>
      this.orderService.getOrders().pipe(
        map(orders => new ordersActions.LoadOrdersSuccess(orders)),
        mapErrorToAction(ordersActions.LoadOrdersFail)
      )
    )
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
