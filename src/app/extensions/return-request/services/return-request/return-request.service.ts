import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap, forkJoin, map, throwError } from 'rxjs';

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
          map(requestRequstPostion =>
            requestData.map(request => {
              const position = requestRequstPostion.find(pos => pos.id === request.id);
              return { ...request, ...position };
            })
          )
        )
      )
    );
  }

  createReturnRequest(orderId: string, body: CreateReturnRequestPayload): Observable<void> {
    return this.apiService.post(`orders/${orderId}/return-requests`, body, {
      headers: this.returnRequestHeaders,
    });
  }
}
