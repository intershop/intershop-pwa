import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Order } from 'ish-core/models/order/order.model';

type OrderColumnsType =
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
 *   [orders]="orders$ | async"
 *   [loading]="loading$ | async"
 *   [columnsToDisplay]="['creationDate', 'orderNoWithLink', 'lineItems', 'status', 'orderTotal']">
 * </ish-order-list>
 */
@Component({
  selector: 'ish-order-list',
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

  /**
   *  get buyer name from order attributes
   */
  getBuyerName(attributes: Attribute[]): string {
    return `${AttributeHelper.getAttributeValueByAttributeName(
      attributes,
      'firstName'
    )} ${AttributeHelper.getAttributeValueByAttributeName(attributes, 'lastName')}`;
  }
}
