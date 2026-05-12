import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, map, tap, throwError } from 'rxjs';

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

  /**
   * Creates a new withdrawal entry based on the provided order data.
   * Sends the withdrawal data as POST body to the withdrawals endpoint.
   *
   * @param withdrawal - The withdrawal data containing `orderDocumentNumber` and `orderEmail` (both required).
   * @returns An observable emitting the created {@link Withdrawal} with status `INITIAL`.
   */
  createWithdrawal(withdrawal: Withdrawal): Observable<Withdrawal> {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
      captcha: pick(withdrawal, ['captcha', 'captchaAction']),
    };

    if (!withdrawal?.orderDocumentNumber || !withdrawal?.orderEmail) {
      return throwError(() => new Error('createWithdrawal() called with missing required data'));
    }

    return this.apiService
      .post<WithdrawalData>(`withdrawals`, withdrawal, { headers: this.withdrawalV1Headers, ...options })
      .pipe(
        map(WithdrawalMapper.fromData),
        tap(data => {
          if (!SSR) {
            sessionStorage.setItem('withdrawal', JSON.stringify(data));
          }
        })
      );
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
      skipApiErrorHandling: true,
      captcha: pick(withdrawal, ['captcha', 'captchaAction']),
    };

    if (!withdrawal?.id) {
      return throwError(() => new Error('sendWithdrawalRequest() called without required withdrawal id'));
    }

    return this.apiService
      .patch<WithdrawalData>(
        `withdrawals/${this.apiService.encodeResourceId(withdrawal.id)}`,
        { ...withdrawal, status: 'CREATED' },
        {
          headers: this.withdrawalV1Headers,
          ...options,
        }
      )
      .pipe(
        map(WithdrawalMapper.fromData),
        tap(data => {
          if (!SSR) {
            sessionStorage.setItem('withdrawal', JSON.stringify(data));
          }
        })
      );
  }
}
