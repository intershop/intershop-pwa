import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Order } from 'ish-core/models/order/order.model';

export type OrderColumnsType =
  | 'creationDate'
  | 'orderNo'
  | 'orderNoWithLink'
  | 'buyer'
  | 'lineItems'
  | 'status'
  | 'destination'
  | 'lineItems'
  | 'orderTotal';

/**
 * The Order List Component displays the orders provided as input parameter.
 *
 * @example
 * <ish-order-list
 *   [columnsToDisplay]="['creationDate', 'orderNoWithLink', 'lineItems', 'status', 'orderTotal']"
 *   [loading]="loading$ | async"
 *   [orders]="orders$ | async"
 * />
 */
@Component({
  selector: 'ish-order-list',
  standalone: false,
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent {
  /**
   * The columns to be displayed.
   */
  @Input({ required: true }) columnsToDisplay: OrderColumnsType[];

  /**
   * The orders to be displayed.
   */
  @Input({ required: true }) orders: Partial<Order>[];

  @Input() noOrdersMessageKey = 'account.orderlist.no_orders_message';

  @Input() loading: boolean;
}
