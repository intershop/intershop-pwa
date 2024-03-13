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

  isServiceAvailable$ = this.store.pipe(
    select(getServerConfigParameter<string>('services.OrganizationHierarchyServiceDefinition.Endpoint')),
    map(url => (url && url.length !== 0 ? true : false))
  );

  groups$ = this.store.pipe(select(getGroupsOfOrganization));
  groupsLoading$ = this.store.pipe(select(getOrganizationGroupsLoading));
  groupsError$ = this.store.pipe(select(getOrganizationGroupsError));

  getSelectedGroup$ = this.store.pipe(select(getSelectedGroupDetails));

  groupsCount$(): Observable<number> {
    const customer$ = this.store.pipe(select(getLoggedInCustomer));
    return customer$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadGroups())),
      switchMap(() => this.store.pipe(select(getGroupsOfOrganizationCount)))
    );
  }

  assignGroup(id: string): void {
    this.store.dispatch(assignGroup({ id }));
  }

  getDetailsOfGroup$(id: string): Observable<OrganizationGroup> {
    return this.store.pipe(select(getGroupDetails(id)));
  }

  // ORDERS
  orders$(query?: OrderListQuery) {
    this.store.dispatch(loadOrdersForBuyingContext({ query: query || { limit: 30 } }));
    return this.store.pipe(select(getOrders));
  }

  groupsOfCurrentUser$() {
    this.store.dispatch(loadGroups());
    return this.groups$;
  }

  getChildrenByParentId(nodeId: string): Observable<OrganizationGroup[]> {
    const childIds$ = this.store.pipe(select(getChilds(nodeId)));
    return childIds$.pipe(
      whenTruthy(),
      switchMap(ids => this.store.pipe(select(getGroupsByID(ids))))
    );
  }

  createAndAddGroup(parentGroupId: string, child: OrganizationGroup) {
    this.store.dispatch(createGroup({ parentGroupId, child }));
  }

  initialData$(): Observable<DynamicFlatNode[]> {
    const tree$ = this.store.pipe(select(getGroupsOfOrganization));
    return tree$.pipe(
      whenTruthy(),
      take(1),
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
   * Retrieve all children tree nodes for a specific node
   * The method will fetch the new data from server when no information is stored in cache
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

  // helper method: according to the selected groupId the corresponding group path in the
  // organizations hierarchy will determined
  determineGroupPath(groupId: string, intermediateResult: string[] = []): Observable<string[]> {
    this.store.pipe(select(getGroupDetails(groupId)), take(1)).subscribe(group => {
      intermediateResult.unshift(group.name);
      if (group.parentId) {
        this.determineGroupPath(group.parentId, intermediateResult);
      }
    });
    return of(intermediateResult);
  }
}
