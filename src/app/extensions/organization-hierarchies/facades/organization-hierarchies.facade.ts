import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { TreeFacade } from 'ish-core/facades/common/tree.facade';
import { OrderListQuery } from 'ish-core/services/order/order.service';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { getOrders } from 'ish-core/store/customer/orders';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { DynamicFlatNode } from 'ish-core/utils/tree/tree.interface';

import { OrganizationGroup } from '../models/organization-group/organization-group.model';
import { loadOrdersForBuyingContext } from '../store/buying-context/buying-context.actions';
import {
  assignGroup,
  createGroup,
  getChilds,
  getGroupDetails,
  getGroupsByID,
  getGroupsOfOrganization,
  getGroupsOfOrganizationCount,
  getOrganizationGroupsError,
  getOrganizationGroupsLoading,
  getSelectedGroupDetails,
  loadGroups,
} from '../store/group';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesFacade implements TreeFacade {
  constructor(private store: Store) {}

  /**
   * Returns an Observable of true if organization hierarchy service is configured in ICM otherwise false.
   */
  isServiceAvailable$ = this.store.pipe(
    select(getServerConfigParameter<string>('services.OrganizationHierarchyServiceDefinition.Endpoint')),
    map(url => (url && url.length !== 0 ? true : false))
  );

  // organization hierarchy groups

  groups$ = this.store.pipe(select(getGroupsOfOrganization));
  groupsLoading$ = this.store.pipe(select(getOrganizationGroupsLoading));
  groupsError$ = this.store.pipe(select(getOrganizationGroupsError));

  /**
   * Returns the current activated organization hierarchy group.
   */
  getSelectedGroup$ = this.store.pipe(select(getSelectedGroupDetails));

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
  getDetailsOfGroup$(id: string): Observable<OrganizationGroup> {
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
   * At first an action of type [Organizational Groups API] Load Groups is triggered, after that an
   * array of organization hierarchy groups will returned.
   *
   * @returns an Observable of an array of organization hierarchy groups
   */
  groupsOfCurrentUser$() {
    this.store.dispatch(loadGroups());
    return this.groups$;
  }

  /**
   * Method to create and add a new organization hierarchy group to the existing organization hierarchy tree.
   *
   * @param parentGroupId id of parent group where the new groups will be attached
   * @param child the OrganizationGroup object for the new created group
   */
  createAndAddGroup(parentGroupId: string, child: OrganizationGroup) {
    this.store.dispatch(createGroup({ parentGroupId, child }));
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
      intermediateResult.unshift(group.name);
      if (group.parentId) {
        this.determineGroupPath(group.parentId, intermediateResult);
      }
    });
    return of(intermediateResult);
  }

  // Angular Material CDK Tree functions

  /**
   * Initial method to collect all necessary data to display an cdk tree for OrganizationGroups.
   *
   * @returns an Observable of an array of DynamicFlatNode
   */
  initialData$(): Observable<DynamicFlatNode[]> {
    const tree$ = this.store.pipe(select(getGroupsOfOrganization));

    return tree$.pipe(
      whenTruthy(),
      map(groups =>
        groups
          .filter(group => !group.parentId)
          .map<DynamicFlatNode>(group => ({
            id: group.id,
            displayName: group.name,
            level: 0, // root
            expandable: group.childrenIds?.length > 0 ? true : false,
          }))
      )
    );
  }

  /**
   * Retrieve all chields as OrganizationGroup array of a parent group.
   */
  getChildrenByParentId(nodeId: string): Observable<OrganizationGroup[]> {
    const childIds$ = this.store.pipe(select(getChilds(nodeId)));
    return childIds$.pipe(
      whenTruthy(),
      switchMap(ids => this.store.pipe(select(getGroupsByID(ids))))
    );
  }

  /**
   * Retrieve all children tree nodes for a specific node.
   * The method will fetch the new data from server when no information is stored in cache.
   */
  getChildren$(nodeId: string): Observable<Omit<DynamicFlatNode, 'level'>[]> {
    return this.getChildrenByParentId(nodeId).pipe(
      map(childNodes =>
        childNodes.map(child => ({
          id: child.id,
          displayName: child.name,
          expandable: child.childrenIds?.length > 0 ? true : false,
        }))
      )
    );
  }
}
