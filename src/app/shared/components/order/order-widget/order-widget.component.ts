import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order Widget Component - displays an overview of the latest orders as list.
 *
 * @example
 * <ish-order-widget></ish-order-widget>
 */
@Component({
  selector: 'ish-order-widget',
  templateUrl: './order-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderWidgetComponent implements OnInit {
  orders$: Observable<Order[]>;
  ordersLoading$: Observable<boolean>;

  constructor(private accountfacade: AccountFacade) {}

  ngOnInit(): void {
    this.orders$ = this.accountfacade.orders$;
    this.ordersLoading$ = this.accountfacade.ordersLoading$;
    this.accountfacade.loadOrders({ limit: 5 });
  }
}
