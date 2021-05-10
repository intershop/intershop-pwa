import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { loadBasket } from 'ish-core/store/customer/basket';
import { loadOrders } from 'ish-core/store/customer/orders';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';

import { assignGroup, loadGroups, loadGroupsFail, loadGroupsSuccess } from './group.actions';

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
          map(groups => loadGroupsSuccess({ groups })),
          mapErrorToAction(loadGroupsFail)
        )
      )
    )
  );

  assignGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignGroup),
      mergeMap(() =>
        this.basketService.getBaskets().pipe(
          switchMap(baskets => {
            if (baskets?.length > 0) {
              return [loadBasket(), loadOrders()];
            } else {
              return [loadOrders()];
            }
          })
        )
      )
    )
  );
}
