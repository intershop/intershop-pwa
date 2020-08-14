import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, of, throwError } from 'rxjs';
import { concatMap, map, switchMap, take } from 'rxjs/operators';

import { OrderData } from 'ish-core/models/order/order.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { RequisitionData } from '../../models/requisition/requisition.interface';
import { RequisitionMapper } from '../../models/requisition/requisition.mapper';
import { Requisition, RequisitionStatus, RequisitionViewer } from '../../models/requisition/requisition.model';

type RequisitionIncludeType =
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

  private allIncludes: RequisitionIncludeType[] = [
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

  /**
   * Get all customer requisitions of a certain status and view. The current user is expected to have the approver permission.
   * @param  view    Defines whether the 'buyer' or 'approver' view is returned. Default: 'buyer'
   * @param  status  Approval status filter ('pending', 'approved', 'rejected'). Default: All requisitions are returned
   * @returns        Requisitions of the customer with their main attributes. To get all properties the getRequisition call is needed.
   */
  getRequisitions(view?: RequisitionViewer, status?: RequisitionStatus): Observable<Requisition[]> {
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

  /**
   * Get a customer requisition of a certain id. The current user is expected to have the approver permission.
   * @param  id      Requisition id.
   * @returns        Requisition with all attributes. If the requisition is approved and the order is placed, also order data are returned as part of the requisition.
   */
  getRequisition(requisitionId: string): Observable<Requisition> {
    if (!requisitionId) {
      return throwError('getRequisition() called without required id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());

    return combineLatest([this.currentCustomer$, this.store.pipe(select(getLoggedInUser), whenTruthy(), take(1))]).pipe(
      switchMap(([customer, user]) =>
        this.apiService
          .get<RequisitionData>(`customers/${customer.customerNo}/users/${user.login}/requisitions/${requisitionId}`, {
            params,
          })
          .pipe(concatMap(payload => this.processRequisitionData(payload)))
      )
    );
  }

  /**
   * Updates the requisition status. The current user is expected to have the approver permission.
   * @param id      Requisition id.
   * @param status  The requisition approval status
   * @param comment The approval comment
   * @returns       The updated requisition with all attributes. If the requisition is approved and the order is placed, also order data are returned as part of the requisition.
   */
  updateRequisitionStatus(
    requisitionId: string,
    status: RequisitionStatus,
    approvalComment?: string
  ): Observable<Requisition> {
    if (!requisitionId) {
      return throwError('updateRequisitionStatus() called without required id');
    }
    if (!status) {
      return throwError('updateRequisitionStatus() called without required requisitionstatus');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      name: 'string',
      type: 'ApprovalStatusChange',
      status,
      approvalComment,
    };

    return combineLatest([this.currentCustomer$, this.store.pipe(select(getLoggedInUser), whenTruthy(), take(1))]).pipe(
      switchMap(([customer, user]) =>
        this.apiService
          .patch<RequisitionData>(
            `customers/${customer.customerNo}/users/${user.login}/requisitions/${requisitionId}`,
            body,
            {
              params,
            }
          )
          .pipe(concatMap(payload => this.processRequisitionData(payload)))
      )
    );
  }

  /**
   *  Gets the order data, if needed and maps the requisition/order data.
   * @param payload  The requisition row data returnedby the REST interface.
   * @returns        The requisition.
   */
  private processRequisitionData(payload: RequisitionData): Observable<Requisition> {
    const params = new HttpParams().set('include', this.allIncludes.join());

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
  }
}
