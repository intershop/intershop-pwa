import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Order } from 'ish-core/models/order/order.model';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

/**
 * The Order Widget Component - displays an overview of the latest orders as list.
 *
 * @example
 * <ish-order-widget />
 */
@Component({
  selector: 'ish-order-widget',
  imports: [AsyncPipe, InfoBoxComponent, OrderListComponent, TranslatePipe],
  standalone: true,
  templateUrl: './order-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderWidgetComponent implements OnInit {
  orders$: Observable<Order[]>;
  ordersLoading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.orders$ = this.accountFacade.orders$;
    this.ordersLoading$ = this.accountFacade.ordersLoading$;
    this.accountFacade.loadOrders({ limit: 5 });
  }
}
