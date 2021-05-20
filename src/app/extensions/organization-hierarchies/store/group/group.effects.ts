import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { loadBasket } from 'ish-core/store/customer/basket';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { assignBuyingContext, assignBuyingContextSuccess } from '../buying-context/buying-context.actions';
import { loadOrderForBuyingContext } from '../order/order.actions';

import { assignGroup, loadGroups, loadGroupsFail, loadGroupsSuccess } from './group.actions';
import { getSelectedGroupDetails } from './group.selectors';

@Injectable()
export class GroupEffects {
  constructor(
    private actions$: Actions,
    private basketService: BasketService,
    private store: Store,
    private organizationService: OrganizationHierarchiesService
  ) {}

  loadGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGroups),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      switchMap(([, customer]) =>
        this.organizationService.getGroups(customer).pipe(
          switchMap(groups => [loadGroupsSuccess({ groups }), assignBuyingContext()]),
          mapErrorToAction(loadGroupsFail)
        )
      )
    )
  );

  assignGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignGroup, assignBuyingContext),
      withLatestFrom(this.store.pipe(select(getSelectedGroupDetails)), this.store.pipe(select(getLoggedInCustomer))),
      map(([, group, customer]) => assignBuyingContextSuccess({ bctx: group.id.concat('@', customer.customerNo) }))
    )
  );

  reloadContext$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignBuyingContextSuccess),
      mergeMap(() =>
        this.basketService.getBaskets().pipe(
          switchMap(baskets => {
            if (baskets?.length > 0) {
              return [loadBasket(), loadOrderForBuyingContext()];
            } else {
              return [loadOrderForBuyingContext()];
            }
          })
        )
      )
    )
  );
}
