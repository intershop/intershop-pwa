import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap, forkJoin, map, throwError } from 'rxjs';

import { OrderData } from 'ish-core/models/order/order.interface';
import { OrderMapper } from 'ish-core/models/order/order.mapper';
import { Order } from 'ish-core/models/order/order.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { ApiService } from 'ish-core/services/api/api.service';

import {
  ReturnReasonData,
  ReturnRequestData,
  ReturnRequestPositionData,
  ReturnableOrdersData,
} from '../../models/return-request/return-request.interface';
import { ReturnRequestMapper } from '../../models/return-request/return-request.mapper';
import {
  CreateReturnRequestPayload,
  ReturnRequest,
  ReturnRequestPosition,
  ReturnablePosition,
} from '../../models/return-request/return-request.model';

@Injectable({ providedIn: 'root' })
export class ReturnRequestService {
  /**
   * http header for IOM API v1
   */
  private returnRequestHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.order-iom-ext.v1+json',
  });

  constructor(private apiService: ApiService) {}

  getOrderReturnReasons(): Observable<SelectOption[]> {
    return this.apiService
      .get<ReturnReasonData[]>(`orders/return-reasons`, {
        headers: this.returnRequestHeaders,
      })
      .pipe(map(ReturnRequestMapper.fromReturnReason));
  }

  getOrderReturnableItems(orderId: string): Observable<ReturnablePosition[]> {
    if (!orderId) {
      return throwError(() => new Error('getOrderReturnRequest() called without orderId'));
    }

    return this.apiService
      .get<ReturnableOrdersData>(`orders/${orderId}/return-requests/returnables`, {
        headers: this.returnRequestHeaders,
      })
      .pipe(map(data => ReturnRequestMapper.fromReturnPosition(data)));
  }

  getOrderReturnRequestPosition(orderId: string, requestId: number): Observable<ReturnRequestPosition[]> {
    return this.apiService
      .get<ReturnRequestPositionData[]>(`orders/${orderId}/return-requests/${requestId}/positions`, {
        headers: this.returnRequestHeaders,
      })
      .pipe(map(data => ReturnRequestMapper.fromReturnRequestPosition(data)));
  }

  getOrderReturnRequest(orderId: string): Observable<ReturnRequest[]> {
    if (!orderId) {
      return throwError(() => new Error('getOrderReturnRequest() called without orderId'));
    }

    return this.apiService
      .get<ReturnRequestData[]>(`orders/${orderId}/return-requests`, {
        headers: this.returnRequestHeaders,
      })
      .pipe(map(data => ReturnRequestMapper.fromReturnRequest(data, orderId)));
  }

  getOrderReturnRequests(orderIds: string[]): Observable<ReturnRequest[]> {
    if (!orderIds.length) {
      return throwError(() => new Error('getOrderReturnRequests() called without orderId'));
    }

    return forkJoin(orderIds.map(id => this.getOrderReturnRequest(id))).pipe(
      map(d => d.flat(1)),
      concatMap(requestData =>
        forkJoin(requestData.map(d => this.getOrderReturnRequestPosition(d.orderId, d.id))).pipe(
          map(d => d.flat(1)),
          map(requestRequestPosition =>
            requestData.map(request => {
              const position = requestRequestPosition.find(pos => pos.id === request.id);
              return { ...request, ...position };
            })
          )
        )
      )
    );
  }

  createReturnRequest(request: CreateReturnRequestPayload): Observable<void> {
    const body = {
      type: request.type,
      positions: request.positions,
      customAttributes: request.customAttributes,
    };
    return this.apiService.post(`orders/${request.orderId}/return-requests`, body, {
      headers: this.returnRequestHeaders,
    });
  }

  /**
   * Gets an anonymous line items with the given id and email.
   *
   * @param documentNo  The (uuid) of the order.
   * @param email email used while placing an order.
   * @returns        The order
   */
  getOrderByDocumentNoAndEmail(documentNo: string, email: string): Observable<Order> {
    if (!documentNo) {
      return throwError(() => new Error('getOrderByDocumentNoAndEmail() called without documentNo'));
    }

    if (!email) {
      return throwError(() => new Error('getOrderByDocumentNoAndEmail() called without email'));
    }

    return this.apiService
      .get<OrderData>(`return/${documentNo}`, {
        params: new HttpParams().append('email', email),
        headers: this.returnRequestHeaders,
      })
      .pipe(map(data => OrderMapper.fromData(data)));
  }

  getOrderReturnableItemsByDocumentNoAndEmail(documentNo: string, email: string): Observable<ReturnablePosition[]> {
    if (!email) {
      return throwError(() => new Error('getOrderReturnableItemsByEmail() called without email'));
    }

    if (!documentNo) {
      return throwError(() => new Error('getOrderReturnableItemsByEmail() called without documentNo'));
    }

    return this.apiService
      .get<{
        returnableData: {
          entity: ReturnableOrdersData;
        };
      }>(`return/${documentNo}/return-requests/returnables`, {
        params: new HttpParams().append('email', email),
        headers: this.returnRequestHeaders,
      })
      .pipe(
        map(data => data.returnableData.entity),
        map(data => ReturnRequestMapper.fromReturnPosition(data))
      );
  }

  createReturnRequestByDocumentNoAndEmail(request: CreateReturnRequestPayload): Observable<void> {
    const body = {
      type: request.type,
      positions: request.positions,
      customAttributes: request.customAttributes,
    };
    return this.apiService.post(`return/${request.documentNo}/return-requests`, body, {
      params: new HttpParams().append('email', request.email),
      headers: this.returnRequestHeaders,
    });
  }
}
