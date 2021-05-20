import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { OrderData } from 'ish-core/models/order/order.interface';
import { OrderMapper } from 'ish-core/models/order/order.mapper';
import { Order } from 'ish-core/models/order/order.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getICMBaseURL } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationGroupListData } from '../../models/organization-group-list/organization-group-list.interface';
import { OrganizationGroupMapper } from '../../models/organization-group/organization-group.mapper';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

type OrderIncludeType =
  | 'invoiceToAddress'
  | 'commonShipToAddress'
  | 'commonShippingMethod'
  | 'discounts'
  | 'lineItems_discounts'
  | 'lineItems'
  | 'payments'
  | 'payments_paymentMethod'
  | 'payments_paymentInstrument';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(private apiService: ApiService, private store: Store, private mapper: OrganizationGroupMapper) {}

  private icmBaseURL$ = this.store.pipe(select(getICMBaseURL), whenTruthy(), take(1));
  private contentTypeHeader = {
    headers: new HttpHeaders({ ['Accept']: 'application/vnd.api+json', ['content-type']: 'application/vnd.api+json' }),
  };

  private orderHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.order.v1+json',
  });

  private allOrderIncludes: OrderIncludeType[] = [
    'invoiceToAddress',
    'commonShipToAddress',
    'commonShippingMethod',
    'discounts',
    'lineItems_discounts',
    'lineItems',
    'payments',
    'payments_paymentMethod',
    'payments_paymentInstrument',
  ];

  getGroups(customer: Customer): Observable<OrganizationGroup[]> {
    return this.icmBaseURL$.pipe(
      switchMap(baseURL =>
        this.apiService
          .get<OrganizationGroupListData>(
            `${baseURL}/organizations/${customer.customerNo}/groups`,
            this.contentTypeHeader
          )
          .pipe(map(list => list.data.map(this.mapper.fromData)))
      )
    );
  }

  getOrders(amount: number = 30, include: string = ''): Observable<Order[]> {
    return this.apiService
      .get<OrderData>(
        `orders?page[limit]=${amount}`.concat('&include=', this.allOrderIncludes.join().concat(include)),
        {
          headers: this.orderHeaders,
        }
      )
      .pipe(map(OrderMapper.fromListData));
  }
}
