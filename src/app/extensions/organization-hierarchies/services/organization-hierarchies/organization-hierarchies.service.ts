import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { OrderListQuery } from 'ish-core/models/order-list-query/order-list-query.model';
import { OrderMapper } from 'ish-core/models/order/order.mapper';
import { Order } from 'ish-core/models/order/order.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { orderListQueryToHttpParams } from 'ish-core/services/order/order.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  OrganizationHierarchiesGroupDocument,
  OrganizationHierarchiesGroupListDocument,
} from '../../models/organization-hierarchies-group/organization-hierarchies-group.interface';
import { OrganizationHierarchiesGroupMapper } from '../../models/organization-hierarchies-group/organization-hierarchies-group.mapper';
import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';

/**
 * Service class to communicate with organization hierarchies service and with the icm server.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(
    private apiService: ApiService,
    private organizationGroupMapper: OrganizationHierarchiesGroupMapper,
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

  /**
   * Returns all existing organization hierarchies groups for a given customer.
   * @param customer is needed for request
   * @returns a list oforganization hierarchies group
   */
  getGroups(customer: Customer): Observable<OrganizationHierarchiesGroup[]> {
    return this.apiService
      .get<OrganizationHierarchiesGroupListDocument>(
        `organizations/${customer.customerNo}/groups`,
        this.contentTypeHeader
      )
      .pipe(map(list => this.organizationGroupMapper.fromDocument(list)));
  }

  /**
   * Organization hierarchies group creation request method.
   * @param parentGroupId id of the parent group node
   * @param child new organization hierarchies group parameter
   * @returns the new created organization hierarchies group
   */
  createGroup(parentGroupId: string, child: OrganizationHierarchiesGroup): Observable<OrganizationHierarchiesGroup> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<OrganizationHierarchiesGroupDocument>(
            `organizations/${customer.customerNo}/groups`,
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

  /**
   * Organization hierarchies group deletion request method.
   * @param groupId id of organization hierarchies group to delete
   */
  deleteGroup(groupId: string) {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.delete(`organizations/${customer.customerNo}/groups/${groupId}`, this.contentTypeHeader)
      )
    );
  }

  /**
   * Gets the orders of the logged-in user with selected buying context
   *
   * @param query   Additional query parameters
   *                - the number of items that should be fetched
   *                - which data should be included.
   * @returns       A list of the user's orders
   */
  getOrders(query: OrderListQuery, buyingContextId: string = ''): Observable<Order[]> {
    let params = orderListQueryToHttpParams(query);
    // for 7.10 compliance - ToDo: will be removed in PWA 6.0
    params = params.set('page[limit]', query.limit);
    return this.apiService
      .get(`orders`.concat('?include=buyingContext&filter[buyingContext]='.concat(buyingContextId)), {
        headers: this.orderHeaders,
        params,
      })
      .pipe(map(OrderMapper.fromListData));
  }
}
