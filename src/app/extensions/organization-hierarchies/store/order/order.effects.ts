import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, map, withLatestFrom } from 'rxjs/operators';

import { loadOrdersFail, loadOrdersSuccess } from 'ish-core/store/customer/orders';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { getBuyingContext } from '../buying-context/buying-context.selectors';

import { loadOrderForBuyingContext } from './order.actions';

@Injectable()
export class OrderEffects {
  static include = ',buyingContext&filter[buyingContext]=';

  constructor(
    private actions$: Actions,
    private organizationHierarchiesService: OrganizationHierarchiesService,
    private store: Store
  ) {}

  /**
   * The load basket eligible shipping methods effect.
   */
  loadOrderByBuyingContext$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderForBuyingContext),
      withLatestFrom(this.store.pipe(select(getBuyingContext))),
      concatMap(([, buyingContext]) =>
        this.organizationHierarchiesService.getOrders(30, OrderEffects.include.concat(buyingContext.bctx)).pipe(
          map(orders => loadOrdersSuccess({ orders })),
          mapErrorToAction(loadOrdersFail)
        )
      )
    )
  );
}
