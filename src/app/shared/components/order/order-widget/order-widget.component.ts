import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Order } from 'ish-core/models/order/order.model';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { OrderListComponent } from '../order-list/order-list.component';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * The Order Widget Component - displays an overview of the latest orders as list.
 *
 * @example
 * <ish-order-widget />
 */
@Component({
  selector: 'ish-order-widget',
  templateUrl: './order-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [InfoBoxComponent, OrderListComponent, AsyncPipe, TranslateModule],
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
