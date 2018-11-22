import { ChangeDetectionStrategy, Component } from '@angular/core';
/**
 * The Order History Page Component displays an order list of a logged in user using the {@link OrderListContainerComponent}
 * see also: {@link OrderHistoryPageContainerComponent}
 *
 * @example
 * <ish-order-history-page></ish-order-history-page>
 */
@Component({
  selector: 'ish-account-order-history-page',
  templateUrl: './account-order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderHistoryPageComponent {}
