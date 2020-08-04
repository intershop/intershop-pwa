import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { concatMap, map, switchMap, take } from 'rxjs/operators';

import { OrderData } from 'ish-core/models/order/order.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { RequisitionData } from '../../models/requisition/requisition.interface';
import { RequisitionMapper } from '../../models/requisition/requisition.mapper';
import { Requisition } from '../../models/requisition/requisition.model';

type BasketIncludeType =
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
export class RequisitionsService {
  constructor(private apiService: ApiService, private store: Store, private requisitionMapper: RequisitionMapper) {}

  private allIncludes: BasketIncludeType[] = [
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

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  private orderHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.order.v1+json',
  });

  getRequisitions(view?: string, status?: string): Observable<Requisition[]> {
    let params = new HttpParams();
    if (view) {
      params = params.set('view', view);
    }
    if (status) {
      params = params.set('status', status);
    }

    return combineLatest([this.currentCustomer$, this.store.pipe(select(getLoggedInUser), whenTruthy(), take(1))]).pipe(
      switchMap(([customer, user]) =>
        this.apiService
          .get<RequisitionData>(`customers/${customer.customerNo}/users/${user.login}/requisitions`, { params })
          .pipe(map(data => this.requisitionMapper.fromListData(data)))
      )
    );
  }

  getRequisition(requisitionId: string): Observable<Requisition> {
    const params = new HttpParams().set('include', this.allIncludes.join());

    return combineLatest([this.currentCustomer$, this.store.pipe(select(getLoggedInUser), whenTruthy(), take(1))]).pipe(
      switchMap(([customer, user]) =>
        this.apiService
          .get<RequisitionData>(`customers/${customer.customerNo}/users/${user.login}/requisitions/${requisitionId}`, {
            params,
          })
          .pipe(
            concatMap(payload => {
              if (!Array.isArray(payload.data)) {
                const requisitionData = payload.data;

                if (requisitionData.order?.itemId) {
                  return this.apiService
                    .get<OrderData>(`orders/${requisitionData.order.itemId}`, {
                      headers: this.orderHeaders,
                      params,
                    })
                    .pipe(map(data => this.requisitionMapper.fromData(payload, data)));
                }
              }

              return of(this.requisitionMapper.fromData(payload));
            })
          )
      )
    );
  }
}
