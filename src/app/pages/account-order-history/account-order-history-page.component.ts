import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Order History Page Container Component renders the account history page of a logged in user using the {@link OrderHistoryPageComponent}
 *
 */
@Component({
  templateUrl: './account-order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderHistoryPageComponent {}
