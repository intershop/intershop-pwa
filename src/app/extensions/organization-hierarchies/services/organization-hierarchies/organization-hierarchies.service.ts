import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { OrderMapper } from 'ish-core/models/order/order.mapper';
import { Order } from 'ish-core/models/order/order.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { OrderListQuery, orderListQueryToHttpParams } from 'ish-core/services/order/order.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  OrganizationGroupDocument,
  OrganizationGroupListDocument,
} from '../../models/organization-group/organization-group.interface';
import { OrganizationGroupMapper } from '../../models/organization-group/organization-group.mapper';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(
    private apiService: ApiService,
    private organizationGroupMapper: OrganizationGroupMapper,
    private store: Store
  ) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  private contentTypeHeader = {
    headers: new HttpHeaders({
      Accept: 'application/vnd.api+json',
      'Access-Control-Allow-Origin': '*',
      ['content-type']: 'application/vnd.api+json',
    }),
  };

  private orderHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.order.v1+json',
  });

  getGroups(customer: Customer): Observable<OrganizationGroup[]> {
    return this.apiService
      .get<OrganizationGroupListDocument>(`/organizations/${customer.customerNo}/groups`, this.contentTypeHeader)
      .pipe(map(list => this.organizationGroupMapper.fromDocument(list)));
  }

  createGroup(parentGroupId: string, child: OrganizationGroup): Observable<OrganizationGroup> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<OrganizationGroupDocument>(
            `/organizations/${customer.customerNo}/groups`,
            this.organizationGroupMapper.toGroupDocument(
              child,
              parentGroupId === customer.customerNo ? undefined : parentGroupId
            ),
            this.contentTypeHeader
          )
          .pipe(
            mapToProperty('data'),
            map(groupData => this.organizationGroupMapper.fromDataReversed(groupData))
          )
      )
    );
  }

  deleteGroup(groupId: string) {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.delete(`/organizations/${customer.customerNo}/groups/${groupId}`, this.contentTypeHeader)
      )
    );
  }

  /**
   * Gets the orders of the logged-in user
   *
   * @param query   Additional query parameters
   *                - the number of items that should be fetched
   *                - which data should be included.
   * @returns       A list of the user's orders
   */
  getOrders(query: OrderListQuery, buyingContextId: string = ''): Observable<Order[]> {
    const params = orderListQueryToHttpParams(query);
    return this.apiService
      .get(`orders`.concat('?include=buyingContext&filter[buyingContext]='.concat(buyingContextId)), {
        headers: this.orderHeaders,
        params,
      })
      .pipe(map(OrderMapper.fromListData));
  }
}
