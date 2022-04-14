import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Order History Page Component renders the account history page of a logged in user.
 *
 */
@Component({
  templateUrl: './account-order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderHistoryPageComponent {}
