import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { WithdrawalFacade } from 'ish-core/facades/withdrawal.facade';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';

/**
 * Page component for the right-of-withdrawal request flow.
 *
 * Orchestrates the two-step withdrawal process:
 * 1. The customer enters the order number and email to look up the order (`createWithdrawal`).
 * 2. The customer confirms and submits the full withdrawal request (`submitWithdrawal`).
 */
@Component({
  selector: 'ish-withdrawal-request-page',
  templateUrl: './withdrawal-request-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WithdrawalFacade],
})
export class WithdrawalRequestPageComponent {
  withdrawal = this.withdrawalFacade.withdrawal;
  loading = this.withdrawalFacade.loading;
  error = this.withdrawalFacade.error;
  initialized = this.withdrawalFacade.initialized;

  params: Signal<{ orderDocumentNumber: string; orderEmail: string }> = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map(params => ({ orderDocumentNumber: params.get('orderDocumentNumber'), orderEmail: params.get('orderEmail') }))
    )
  );

  constructor(private withdrawalFacade: WithdrawalFacade) {}

  createWithdrawal(data: Withdrawal) {
    this.withdrawalFacade.createWithdrawal(data);
  }

  submitWithdrawal(data: Withdrawal) {
    this.withdrawalFacade.sendWithdrawal(data);
  }
}
