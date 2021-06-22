import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Order } from 'ish-core/models/order/order.model';

type OrderColumnsType =
  | 'creationDate'
  | 'orderNo'
  | 'lineItems'
  | 'status'
  | 'destination'
  | 'lineItems'
  | 'orderTotal';

/**
 * The Order List Container Component fetches order data and displays them all (or only a limited amount) using the {@link OrderListComponent}
 *
 * @example
 * displays all orders in a more compact manner.
 * <ish-order-list
 *    maxListItems="0"
 *    [columnsToDisplay]="['creationDate', 'orderNo', 'lineItems', 'status', 'lineItems', 'orderTotal']">
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
   * Default: All columns
   */
  @Input() columnsToDisplay?: OrderColumnsType[] = [
    'creationDate',
    'orderNo',
    'lineItems',
    'status',
    'destination',
    'orderTotal',
  ];

  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.orders$ = this.accountFacade
      .orders$()
      .pipe(map(orders => (this.maxListItems ? orders?.slice(0, this.maxListItems) : orders)));
    this.loading$ = this.accountFacade.ordersLoading$;
  }
}
