import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Order } from 'ish-core/models/order/order.model';

type OrderColumnsType =
  | 'creationDate'
  | 'orderNo'
  | 'buyer'
  | 'lineItems'
  | 'status'
  | 'destination'
  | 'lineItems'
  | 'orderTotal';

/**
 * The Order List Component displays the orders provided as input parameter. The number of displayed items can be limited by the maxListItems input parameter.
 * If no order data are provided all orders of the current user will be fetched from store and displayed.
 *
 * @example
 * displays all orders of the current user in a more compact manner.
 * <ish-order-list
 *    maxListItems="0"
 *    [columnsToDisplay]="['creationDate', 'orderNo', 'lineItems', 'status', 'orderTotal']">
 * </ish-order-list>
 */
@Component({
  selector: 'ish-order-list',
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  /**
   * The maximum number of items to be displayed.
   * Use 0, if you want to display all items without any restrictions.
   * Default: 30 items will be displayed
   */
  @Input() maxListItems = 30;
  /**
   * The columns to be displayed.
   * Default: All columns besides the buyer
   */
  @Input() columnsToDisplay: OrderColumnsType[] = [
    'creationDate',
    'orderNo',
    'lineItems',
    'status',
    'destination',
    'orderTotal',
  ];

  /**
   * The orders to be displayed.
   * Default: Orders of the current user are shown.
   */
  @Input() orders: Partial<Order>[];

  orders$: Observable<Partial<Order>[]>;
  loading$: Observable<boolean>;

  noOrdersMessageKey = 'account.orderlist.no_orders_message';

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.orders$ = (this.orders ? of(this.orders) : this.accountFacade.orders$()).pipe(
      map(orders => (this.maxListItems ? orders?.slice(0, this.maxListItems) : orders))
    );
    this.loading$ = this.accountFacade.ordersLoading$;

    if (!this.orders) {
      this.noOrdersMessageKey = 'account.orderlist.no_placed_orders_message';
    }
  }

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
