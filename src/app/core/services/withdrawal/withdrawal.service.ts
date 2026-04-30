import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, map, of } from 'rxjs';

import { WithdrawalData } from 'ish-core/models/withdrawal/withdrawal.interface';
import { WithdrawalMapper } from 'ish-core/models/withdrawal/withdrawal.mapper';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

/**
 * Service for handling withdrawal (right of withdrawal) requests.
 * Provides methods to create a new withdrawal entry and to submit the full withdrawal request.
 */
@Injectable({ providedIn: 'root' })
export class WithdrawalService {
  /**
   * http header for Withdrawal API v1
   */
  private withdrawalV1Headers = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.withdrawal.v1+json',
  });

  constructor(private apiService: ApiService) {}

  mockWithdrawalOrderData: Withdrawal = {
    orderDocumentNumber: 'test',
    orderEmail: 'example@example.com',
    id: '1123232212',
    status: 'INITIAL',
  };

  mockWithdrawalData: Withdrawal = {
    orderDocumentNumber: 'test',
    orderEmail: 'example@example.com',
    confirmationEmail: 'confirmation@example.com',
    name: 'John Doe',
    id: '1123232212',
    status: 'CREATED',
  };

  /**
   * Creates a new withdrawal entry based on the provided order data.
   * Passes the order document number and order email as query parameters.
   *
   * @param data - The withdrawal data containing at least `orderDocumentNumber` and `orderEmail`.
   * @returns An observable emitting the created {@link Withdrawal} with status `INITIAL`.
   */
  createWithdrawal(data: Withdrawal): Observable<Withdrawal> {
    const params = new HttpParams()
      .set('orderDocumentNumber', data.orderDocumentNumber)
      .set('orderEmail', data.orderEmail);
    const options: AvailableOptions = {
      captcha: pick(data, ['captcha', 'captchaAction']),
      params,
    };

    // only for testing purposes, if order number is 'test', return mock data, otherwise call API
    if (data.orderDocumentNumber === 'test') {
      return of(this.mockWithdrawalOrderData);
    }

    return this.apiService
      .post<WithdrawalData>(`withdrawals`, data, { headers: this.withdrawalV1Headers, ...options })
      .pipe(map(WithdrawalMapper.fromData));
  }

  /**
   * Submits the full withdrawal request for an existing withdrawal entry.
   * Updates the withdrawal with the customer's confirmation details (name, confirmation email).
   *
   * @param withdrawal - The withdrawal data including the `id` of the existing entry and additional customer details.
   * @returns An observable emitting the updated {@link Withdrawal} with status `CREATED`.
   */
  sendWithdrawalRequest(withdrawal: Withdrawal): Observable<Withdrawal> {
    const options: AvailableOptions = {
      captcha: pick(withdrawal, ['captcha', 'captchaAction']),
    };
    if (withdrawal.orderDocumentNumber === 'test') {
      return of(this.mockWithdrawalData);
    }
    return this.apiService
      .patch<WithdrawalData>(`withdrawals/${this.apiService.encodeResourceId(withdrawal.id)}`, withdrawal, {
        headers: this.withdrawalV1Headers,
        ...options,
      })
      .pipe(map(WithdrawalMapper.fromData));
  }
}
