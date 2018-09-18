import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderView } from '../../../models/order/order.model';

/**
 * The Order List Component displays all (or only a limited amount of) orders. See also {@link OrderListContainerComponent}
 *
 * @example
 * <ish-order-list [orders]="orders"></ish-order-list>
 */
@Component({
  selector: 'ish-order-list',
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent {
  /**
   * An array of orders to be displayed.
   */
  @Input()
  orders: OrderView[];

  /**
   * The maximum number of items to be displayed.
   * Use 0, if you want to display all items without any restrictions.
   * Default value: see {@link OrderListContainerComponent}
   */
  @Input()
  maxListItems: number;

  /**
   * Indicates whether or not the list should be displayed in a compact view (single row)
   * Default: A detailed list will be displayed
   */
  @Input()
  compact = false;
}
