import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderView } from '../../../models/order/order.model';

/**
 * The Order Page Component displays the details of an order. See also {@link OrderPageContainerComponent}
 *
 * @example
 * <ish-order-page [order]="order"></ish-order-page>
 */
@Component({
  selector: 'ish-order-page',
  templateUrl: './order-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageComponent {
  @Input()
  order: OrderView;
}
