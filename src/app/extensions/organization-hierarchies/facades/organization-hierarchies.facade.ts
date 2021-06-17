import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { getOrders } from 'ish-core/store/customer/orders';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrderGroupPath } from '../models/order-group-path/order-group-path.model';
import { OrganizationGroup } from '../models/organization-group/organization-group.model';
import {
  assignGroup,
  getCurrentGroupPath,
  getGroupDetails,
  getGroupsOfOrganization,
  getGroupsOfOrganizationCount,
  getSelectedGroupDetails,
  loadGroups,
} from '../store/group';
import {
  getOrderGroupPathDetails,
  getOrderGroupPathError,
  getOrderGroupPathLoading,
  loadOrdersWithGroupPaths,
} from '../store/order-group-path';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesFacade {
  constructor(private store: Store) {}

  groups$ = this.store.pipe(select(getGroupsOfOrganization));

  getSelectedGroup$ = this.store.pipe(select(getSelectedGroupDetails));

  orderGroupPathLoading$ = this.store.pipe(select(getOrderGroupPathLoading));
  orderGroupPathLoadingError$ = this.store.pipe(select(getOrderGroupPathError));

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

  getDetailsOfOrderGroupPath$(orderId: string): Observable<OrderGroupPath> {
    return this.store.pipe(select(getOrderGroupPathDetails(orderId)));
  }

  getDetailsOfBasketGroupPath$(): Observable<OrderGroupPath> {
    return this.store.pipe(select(getCurrentGroupPath));
  }

  // ORDERS

  orders$() {
    this.store.dispatch(loadOrdersWithGroupPaths());
    return this.store.pipe(select(getOrders));
  }
}
