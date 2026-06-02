import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { WithdrawalFacade } from 'ish-core/facades/withdrawal.facade';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { WithdrawalRequestFormComponent } from './withdrawal-request-form/withdrawal-request-form.component';

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
  standalone: true,
  imports: [
    ErrorMessageComponent,
    LoadingComponent,
    ServerHtmlDirective,
    TranslatePipe,
    WithdrawalRequestFormComponent,
  ],
  providers: [WithdrawalFacade],
})
export class WithdrawalRequestPageComponent {
  private withdrawalFacade = inject(WithdrawalFacade);

  withdrawal = this.withdrawalFacade.withdrawal;
  loading = this.withdrawalFacade.loading;
  error = this.withdrawalFacade.error;
  initialized = this.withdrawalFacade.initialized;

  createWithdrawal(data: Withdrawal) {
    this.withdrawalFacade.createWithdrawal(data);
  }

  submitWithdrawal(data: Withdrawal) {
    this.withdrawalFacade.sendWithdrawal(data);
  }
}
