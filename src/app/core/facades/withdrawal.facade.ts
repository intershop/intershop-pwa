import { Injectable, signal } from '@angular/core';
import { take } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { WithdrawalService } from 'ish-core/services/withdrawal/withdrawal.service';

@Injectable()
export class WithdrawalFacade {
  constructor(private withdrawalService: WithdrawalService) {}

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

  getWithdrawalFromLocalStorage(): void {
    const storedWithdrawal = localStorage.getItem('withdrawal');
    if (storedWithdrawal) {
      this.withdrawalSignal.set(JSON.parse(storedWithdrawal));
    }
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
          localStorage.setItem('withdrawal', JSON.stringify(data));
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
          localStorage.setItem('withdrawal', JSON.stringify(data));
          this.withdrawalSignal.set(data);
          this.loadingSignal.set(false);
        },
        error: (err: HttpError) => {
          this.errorSignal.set(err);
          this.loadingSignal.set(false);
        },
      });
  }

  cleanup(): void {
    localStorage.removeItem('withdrawal');
  }
}
