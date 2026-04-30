import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { WithdrawalService } from 'ish-core/services/withdrawal/withdrawal.service';

@Injectable()
export class WithdrawalFacade {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private withdrawalService: WithdrawalService
  ) {}

  // Private writable signals for internal state management
  private withdrawalSignal = signal<Withdrawal | undefined>(undefined);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<HttpError | undefined>(undefined);
  private errorTypeSignal = signal<{ type: 'EXPIRED' | 'ALREADY_USED' }>(undefined);

  // Public readonly signals - exposed to components
  withdrawal = this.withdrawalSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  errorType = this.errorTypeSignal.asReadonly();

  // Flag to prevent multiple initial route processing
  initialRouteChanges = false;

  /**
   * Checks the route for withdrawal query parameters and loads the corresponding withdrawal if present.
   * Only necessary for reload scenarios.
   */
  getWithdrawalFromRoute(): void {
    this.activatedRoute.queryParamMap
      .pipe(
        filter(params => params.has('withdrawal')),
        filter(() => !this.initialRouteChanges),
        map(
          params =>
            JSON.parse(decodeURIComponent(params.get('withdrawal')!)) as {
              orderDocumentNumber: string;
              orderEmail: string;
              id: string;
            }
        )
      )
      .subscribe(withdrawal => {
        console.log('Parsed withdrawal from route:', withdrawal);
        this.initialRouteChanges = false;
        if (withdrawal.id && withdrawal.orderDocumentNumber) {
          this.withdrawalSignal.set(withdrawal as Withdrawal);
        } else {
          this.withdrawalSignal.set({ ...withdrawal, status: 'CREATED' });
        }
      });
  }

  /**
   * Creates a new withdrawal entry.
   * Updates loading, withdrawal, and error signals based on the result.
   */
  createWithdrawal(orderDocumentNumber: string, orderEmail: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(undefined);

    this.withdrawalService
      .createWithdrawal({ orderDocumentNumber, orderEmail })
      .pipe(take(1))
      .subscribe({
        next: data => {
          this.router.navigate([], {
            queryParams: {
              withdrawal: encodeURIComponent(
                JSON.stringify({
                  orderDocumentNumber: data.orderDocumentNumber,
                  orderEmail: data.orderEmail,
                  id: data.id,
                })
              ),
            },
            queryParamsHandling: 'merge',
          });
          this.initialRouteChanges = true;
          this.withdrawalSignal.set(data);
          this.loadingSignal.set(false);
        },
        error: (err: HttpError) => {
          this.errorSignal.set(err);
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Submits a withdrawal request.
   * Updates loading, withdrawal, and error signals based on the result.
   */
  sendWithdrawal(withdraw: Withdrawal): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(undefined);

    this.withdrawalService
      .sendWithdrawalRequest(withdraw)
      .pipe(take(1))
      .subscribe({
        next: data => {
          this.router.navigate([], {
            queryParams: {
              withdrawal: encodeURIComponent(
                JSON.stringify({
                  orderDocumentNumber: data.orderDocumentNumber,
                })
              ),
            },
          });
          this.initialRouteChanges = true;
          this.withdrawalSignal.set(data);
          this.loadingSignal.set(false);
        },
        error: (err: HttpError) => {
          this.errorSignal.set(err);
          this.loadingSignal.set(false);
        },
      });
  }
}
