import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';

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
export class WithdrawalRequestPageComponent implements OnInit {
  withdrawal = this.withdrawalFacade.withdrawal;
  loading = this.withdrawalFacade.loading;
  error = this.withdrawalFacade.error;
  initialized = this.withdrawalFacade.initialized;
  predefinedOrderNumber: string;
  predefinedOrderEmail: string;

  private destroyRef = inject(DestroyRef);

  constructor(
    private withdrawalFacade: WithdrawalFacade,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map(params => [params.get('orderDocumentNumber'), params.get('orderEmail')]),
        filter(([orderDocumentNumber, orderEmail]) => !!orderDocumentNumber && !!orderEmail),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([orderDocumentNumber, orderEmail]) => {
        this.predefinedOrderNumber = orderDocumentNumber;
        this.predefinedOrderEmail = orderEmail;
      });
  }

  createWithdrawal(data: Withdrawal) {
    this.withdrawalFacade.createWithdrawal(data);
  }

  submitWithdrawal(data: Withdrawal) {
    this.withdrawalFacade.sendWithdrawal(data);
  }
}
