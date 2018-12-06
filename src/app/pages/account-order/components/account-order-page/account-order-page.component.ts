import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderView } from 'ish-core/models/order/order.model';

/**
 * The Order Page Component displays the details of an order. See also {@link OrderPageContainerComponent}
 *
 * @example
 * <ish-order-page [order]="order"></ish-order-page>
 */
@Component({
  selector: 'ish-account-order-page',
  templateUrl: './account-order-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderPageComponent {
  @Input()
  order: OrderView;
}
