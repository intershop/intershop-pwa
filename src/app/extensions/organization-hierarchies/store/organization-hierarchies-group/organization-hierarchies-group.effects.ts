import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { createBasket, loadBasketWithId } from 'ish-core/store/customer/basket';
import { loadOrdersFail, loadOrdersForBuyingContext, loadOrdersSuccess } from 'ish-core/store/customer/orders';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { getBuyingContext } from '../buying-context';
import { assignBuyingContextSuccess } from '../buying-context/buying-context.actions';

import {
  assignGroup,
  createGroup,
  createGroupFail,
  deleteGroup,
  deleteGroupFail,
  loadGroups,
  loadGroupsFail,
  loadGroupsSuccess,
} from './organization-hierarchies-group.actions';

@Injectable()
export class OrganizationHierarchiesGroupEffects {
  constructor(
    private actions$: Actions,
    private basketService: BasketService,
    private router: Router,
    private store: Store,
    private organizationService: OrganizationHierarchiesService
  ) {}

  // log in leads to
  loadGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGroups),
      concatLatestFrom(() => [this.store.pipe(select(getLoggedInCustomer))]),
      switchMap(([, customer]) =>
        this.organizationService.getGroups(customer).pipe(
          switchMap(groups => [
            loadGroupsSuccess({ groups }),
            assignGroup({ id: groups.length > 0 ? groups[0].id : undefined }),
          ]),
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
                loadOrdersForBuyingContext({ query: { limit: this.getOrderPageLimit() } }),
              ];
            } else {
              return [createBasket(), loadOrdersForBuyingContext({ query: { limit: this.getOrderPageLimit() } })];
            }
          })
        )
      )
    )
  );

  // selection of a new group (buying context) leads to
  loadOrdersWithGroupPaths$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrdersForBuyingContext),
      mapToPayloadProperty('query'),
      concatLatestFrom(() => this.store.pipe(select(getBuyingContext))),
      filter(([, buyingContext]) => buyingContext?.bctx?.length > 0),
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

  private getOrderPageLimit(): number {
    return this.router.url.endsWith('orders') ? 30 : 5;
  }
}
