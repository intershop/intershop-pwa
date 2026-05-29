import { Injectable, OnDestroy, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { WithdrawalService } from 'ish-core/services/withdrawal/withdrawal.service';

@Injectable()
export class WithdrawalFacade implements OnDestroy {
  constructor(
    private withdrawalService: WithdrawalService,
    private toastrService: ToastrService
  ) {
    if (!SSR) {
      const storedWithdrawal = sessionStorage.getItem('withdrawal');
      if (storedWithdrawal) {
        this.withdrawalSignal.set(JSON.parse(storedWithdrawal));
      }
      this.initializedSignal.set(true);
    }
  }

  // Private writable signals for internal state management
  private withdrawalSignal = signal<Withdrawal | undefined>(undefined);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<HttpError | undefined>(undefined);
  private initializedSignal = signal<boolean>(false);

  // Public readonly signals - exposed to components
  withdrawal = this.withdrawalSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  /** Indicates whether the client has finished initializing (sessionStorage loaded). */
  initialized = this.initializedSignal.asReadonly();

  /**
   * Creates a new withdrawal entry.
   * Updates loading, withdrawal, and error signals based on the result.
   */
  createWithdrawal(withdrawal: Withdrawal): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(undefined);

    this.withdrawalService
      .createWithdrawal(withdrawal)
      .pipe(take(1))
      .subscribe({
        next: data => {
          this.toastrService.clear();
          this.withdrawalSignal.set(data);
          this.loadingSignal.set(false);
        },
        error: (err: HttpError) => {
          this.errorSignal.set(
            err.errors ? err : { name: 'HttpErrorResponse', message: 'common.request.error.invalid_data' }
          );
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
          this.toastrService.clear();
          this.withdrawalSignal.set(data);
          this.loadingSignal.set(false);
        },
        error: (err: HttpError) => {
          this.errorSignal.set(
            err.errors ? err : { name: 'HttpErrorResponse', message: 'common.request.error.invalid_data' }
          );
          this.loadingSignal.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    if (!SSR) {
      sessionStorage.removeItem('withdrawal');
    }
  }
}
