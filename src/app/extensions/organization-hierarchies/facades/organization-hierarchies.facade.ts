import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { OrderListQuery } from 'ish-core/services/order/order.service';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { getOrders, loadOrdersForBuyingContext } from 'ish-core/store/customer/orders';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationHierarchiesGroup } from '../models/organization-hierarchies-group/organization-hierarchies-group.model';
import {
  assignGroup,
  createGroup,
  deleteGroup,
  getGroupDetails,
  getGroupsOfOrganization,
  getGroupsOfOrganizationCount,
  getOrganizationGroupsError,
  getOrganizationGroupsLoading,
  getRootGroupDetails,
  getSelectedGroupDetails,
  loadGroups,
} from '../store/organization-hierarchies-group';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesFacade {
  constructor(private store: Store) {}

  /**
   * Returns an Observable of true if organization hierarchy service is configured in ICM otherwise false.
   */
  isServiceAvailable$ = this.store.pipe(
    select(getServerConfigParameter<boolean>('services.OrganizationHierarchyServiceDefinition.runnable'))
  );

  // organization hierarchy groups

  groups$ = this.store.pipe(select(getGroupsOfOrganization));
  groupsLoading$ = this.store.pipe(select(getOrganizationGroupsLoading));
  groupsError$ = this.store.pipe(select(getOrganizationGroupsError));

  /**
   * Returns the current activated organization hierarchy group.
   */
  getSelectedGroup$ = this.store.pipe(select(getSelectedGroupDetails));

  getRootGroup$ = this.store.pipe(select(getRootGroupDetails));

  /**
   * Returns the number organization hierarchy groups for the current customer.
   */
  groupsCount$(): Observable<number> {
    const customer$ = this.store.pipe(select(getLoggedInCustomer));
    return customer$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadGroups())),
      switchMap(() => this.store.pipe(select(getGroupsOfOrganizationCount)))
    );
  }

  /**
   * Triggers an action of type [Organizational Groups API] Assign Group, this leads to a new selected
   * group with given id.
   *
   * @param id group id
   */
  assignGroup(id: string): void {
    this.store.dispatch(assignGroup({ id }));
  }

  /**
   * Returns an Observable of OrganizationGroup for given id.
   *
   * @param id group id
   * @returns an Observable of OrganizationGroup for given id
   */
  getDetailsOfGroup$(id: string): Observable<OrganizationHierarchiesGroup> {
    return this.store.pipe(select(getGroupDetails(id)));
  }

  // ORDERS

  /**
   * Returns all orders with the current buying context.
   *
   * @param query OrderListQuery for custom page limit
   * @returns orders with the current buying context
   */
  orders$(query?: OrderListQuery) {
    this.store.dispatch(loadOrdersForBuyingContext({ query: query || { limit: 30 } }));
    return this.store.pipe(select(getOrders));
  }

  /**
   * Method to create and add a new organization hierarchy group to the existing organization hierarchy tree.
   *
   * @param parentGroupId id of parent group where the new groups will be attached
   * @param child the OrganizationGroup object for the new created group
   */
  createAndAddGroup(parentGroupId: string, child: OrganizationHierarchiesGroup) {
    this.store.dispatch(createGroup({ parentGroupId, child }));
  }

  /**
   * Method to delete an organization hierarchy group of the existing organization hierarchy tree.
   *
   * @param groupId id of group to delete
   */
  deleteGroup(groupId: string) {
    this.store.dispatch(deleteGroup({ groupId }));
  }

  /**
   * Method for determining the corresponding group path, starting from the group with given group id.
   * This method invokes itself until it reaches the root of the organization hierarchies tree.
   *
   * @param groupId id of the starting group
   * @param intermediateResult
   * @returns an Observable of a string array, this array contains the sorted groups ids of the path
   */
  determineGroupPath(groupId: string, intermediateResult: string[] = []): Observable<string[]> {
    this.store.pipe(select(getGroupDetails(groupId)), take(1)).subscribe(group => {
      intermediateResult.unshift(group.displayName);
      if (group.parentId) {
        this.determineGroupPath(group.parentId, intermediateResult);
      }
    });
    return of(intermediateResult);
  }
}
