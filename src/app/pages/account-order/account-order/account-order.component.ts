import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order Page Component displays the details of an order. See also {@link OrderPageContainerComponent}
 *
 * @example
 * <ish-order-page [order]="order"></ish-order-page>
 */
@Component({
  selector: 'ish-account-order',
  templateUrl: './account-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderComponent {
  @Input() order: Order;
}
