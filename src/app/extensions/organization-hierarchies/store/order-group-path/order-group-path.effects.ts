import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { loadOrdersSuccess } from 'ish-core/store/customer/orders';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { getBuyingContext } from '../buying-context/buying-context.selectors';
import {
  loadOrdersWithGroupPaths,
  loadOrdersWithGroupPathsFail,
  loadOrdersWithGroupPathsSuccess,
} from '../order-group-path';

@Injectable()
export class OrderGroupPathEffects {
  static include = ',buyingContext&filter[buyingContext]=';

  constructor(
    private actions$: Actions,
    private organizationHierarchiesService: OrganizationHierarchiesService,
    private store: Store
  ) {}

  /**
   * The load orders and corresponding order group paths effect.
   */
  loadOrdersWithGroupPaths$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrdersWithGroupPaths),
      withLatestFrom(this.store.pipe(select(getBuyingContext))),
      concatMap(([, buyingContext]) =>
        this.organizationHierarchiesService
          .getOrders(30, OrderGroupPathEffects.include.concat(buyingContext.bctx))
          .pipe(
            switchMap(data => [
              loadOrdersSuccess({ orders: data.orders }),
              loadOrdersWithGroupPathsSuccess({ paths: data.paths }),
            ]),
            mapErrorToAction(loadOrdersWithGroupPathsFail)
          )
      )
    )
  );
}
