import { Injectable } from '@angular/core';
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
  deleteGroup,
  deleteGroupFail,
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
    private organizationService: OrganizationHierarchiesService
  ) {}

  // log in leads to
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

  // successful group assignment leads to reloading of basket and orders
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

  // selection of a new group (buying context) leads to
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

  // creation of a new group leads to
  createNewGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createGroup),
      mapToPayload(),
      concatMap(newGroup =>
        this.organizationService.createGroup(newGroup.parentGroupId, newGroup.child).pipe(
          mergeMap(() => [
            loadGroups(),
            displaySuccessMessage({
              message: 'account.organization.hierarchies.groups.new.confirmation',
              messageParams: { 0: newGroup.child.displayName },
            }),
          ]),
          mapErrorToAction(createGroupFail)
        )
      )
    )
  );

  // deletion of a group leads to deletion REST request and reloading of the organization structure
  deleteGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteGroup),
      mapToPayload(),
      concatMap(payload =>
        this.organizationService.deleteGroup(payload.groupId).pipe(
          mergeMap(() => [
            loadGroups(),
            displaySuccessMessage({
              message: 'account.organization.hierarchies.groups.delete.confirmation',
              messageParams: { 0: payload.groupId },
            }),
          ]),
          mapErrorToAction(deleteGroupFail)
        )
      )
    )
  );
}
