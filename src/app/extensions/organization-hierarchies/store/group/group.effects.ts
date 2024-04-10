import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { createBasket, loadBasketWithId } from 'ish-core/store/customer/basket';
import { loadOrdersFail, loadOrdersSuccess, loadWidgetOrders } from 'ish-core/store/customer/orders';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { getBuyingContext } from '../buying-context';
import { assignBuyingContextSuccess, loadOrdersForBuyingContext } from '../buying-context/buying-context.actions';

import {
  assignGroup,
  createGroup,
  createGroupFail,
  createGroupSuccess,
  loadGroups,
  loadGroupsFail,
  loadGroupsSuccess,
} from './group.actions';
import { getSelectedGroupDetails } from './group.selectors';

@Injectable()
export class GroupEffects {
  constructor(
    private actions$: Actions,
    private basketService: BasketService,
    private store: Store,
    private organizationService: OrganizationHierarchiesService,
    private router: Router
  ) {}

  loadGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGroups),
      concatLatestFrom(() => [
        this.store.pipe(select(getSelectedGroupDetails)),
        this.store.pipe(select(getLoggedInCustomer)),
      ]),
      switchMap(([, selectedGroup, customer]) =>
        this.organizationService.getGroups(customer).pipe(
          switchMap(groups => {
            const selectedGroupId = selectedGroup ? selectedGroup.id : groups[0].id;
            return [loadGroupsSuccess({ groups, selectedGroupId }), assignGroup({ id: selectedGroupId })];
          }),
          mapErrorToAction(loadGroupsFail)
        )
      )
    )
  );

  // seletion of a group leads to
  assignGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignGroup),
      mapToPayloadProperty('id'),
      concatLatestFrom(() => [this.store.pipe(select(getLoggedInCustomer))]),
      map(([id, customer]) =>
        assignBuyingContextSuccess({
          bctx: id.concat('@', customer.customerNo),
        })
      )
    )
  );

  reloadContext$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignBuyingContextSuccess),
      mergeMap(() =>
        this.basketService.getBaskets().pipe(
          switchMap(baskets => {
            if (baskets?.length > 0) {
              return [
                loadBasketWithId({ basketId: baskets[0].id }),
                loadOrdersForBuyingContext({ query: { limit: 30 } }),
              ];
            } else {
              return [createBasket(), loadOrdersForBuyingContext({ query: { limit: 30 } })];
            }
          })
        )
      )
    )
  );

  /**
   * The load orders and corresponding order group paths effect.
   */
  loadOrdersWithGroupPaths$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrdersForBuyingContext, loadWidgetOrders),
      mapToPayloadProperty('query'),
      concatLatestFrom(() => this.store.pipe(select(getBuyingContext))),
      concatMap(([query, buyingContext]) =>
        this.organizationService.getOrders(query, buyingContext.bctx).pipe(
          map(orders => loadOrdersSuccess({ orders })),
          mapErrorToAction(loadOrdersFail)
        )
      )
    )
  );

  createNewGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createGroup),
      mapToPayload(),
      concatMap(newGroup =>
        this.organizationService.createGroup(newGroup.parentGroupId, newGroup.child).pipe(
          mergeMap(group => [
            createGroupSuccess({ group }),
            displaySuccessMessage({
              message: 'account.organization.hierarchies.groups.new.confirmation',
              messageParams: { 0: newGroup.child.name },
            }),
          ]),
          mapErrorToAction(createGroupFail)
        )
      )
    )
  );

  redirectAfterCreateNewGroup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createGroupSuccess),
        concatMap(async () => this.navigateTo('../'))
      ),
    { dispatch: false }
  );

  private navigateTo(path: string): void {
    // find current ActivatedRoute by following first activated children
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    this.router.navigate([path], { relativeTo: currentRoute });
  }
}
