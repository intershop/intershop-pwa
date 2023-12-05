import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { OrderService } from 'ish-core/services/order/order.service';
import { loadOrdersSuccess } from 'ish-core/store/customer/orders';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { getBuyingContext } from '../buying-context/buying-context.selectors';

import {
  loadOrdersWithGroupPaths,
  loadOrdersWithGroupPathsFail,
  loadOrdersWithGroupPathsSuccess,
} from './order-group-path.actions';

@Injectable()
export class OrderGroupPathEffects {
  constructor(
    private actions$: Actions,
    private organizationHierarchiesService: OrganizationHierarchiesService,
    private orderService: OrderService,
    private store: Store
  ) {}

  /**
   * The load orders and corresponding order group paths effect.
   */
  loadOrdersWithGroupPaths$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrdersWithGroupPaths),
      withLatestFrom(this.store.pipe(select(getBuyingContext))),
      concatMap(([, buyingContext]) => {
        if (buyingContext.group?.parentid) {
          return this.organizationHierarchiesService.getOrders(30, buyingContext.bctx).pipe(
            switchMap(data => [
              loadOrdersSuccess({ orders: data.orders }),
              loadOrdersWithGroupPathsSuccess({ paths: data.paths }),
            ]),
            mapErrorToAction(loadOrdersWithGroupPathsFail)
          );
        } else {
          return this.orderService.getOrders().pipe(
            map(data => loadOrdersSuccess({ orders: data })),
            mapErrorToAction(loadOrdersWithGroupPathsFail)
          );
        }
      })
    )
  );
}
