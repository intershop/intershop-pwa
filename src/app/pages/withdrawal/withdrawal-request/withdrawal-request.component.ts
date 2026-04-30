import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

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
  selector: 'ish-withdrawal-request',
  templateUrl: './withdrawal-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WithdrawalFacade],
})
export class WithdrawalRequestComponent implements OnInit {
  private withdrawalFacade = inject(WithdrawalFacade);

  withdrawal = this.withdrawalFacade.withdrawal;
  loading = this.withdrawalFacade.loading;
  error = this.withdrawalFacade.error;

  ngOnInit(): void {
    this.withdrawalFacade.getWithdrawalFromRoute();
  }

  createWithdrawal(data: { orderDocumentNumber: string; orderEmail: string }) {
    this.withdrawalFacade.createWithdrawal(data.orderDocumentNumber, data.orderEmail);
  }

  submitWithdrawal(data: Withdrawal) {
    this.withdrawalFacade.sendWithdrawal(data);
  }
}
