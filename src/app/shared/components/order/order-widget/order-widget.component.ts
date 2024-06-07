import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, filter, switchMap } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { OrderListQuery } from 'ish-core/models/order-list-query/order-list-query.model';
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

  private destroyRef = inject(DestroyRef);

  private query: OrderListQuery = { limit: 5 };

  constructor(private accountfacade: AccountFacade) {}

  ngOnInit(): void {
    this.accountfacade.customer$
      .pipe(
        filter(customer => customer.isBusinessCustomer),
        switchMap(() =>
          this.accountfacade.roles$.pipe(
            filter(roles => roles.map(roles => roles.roleId).includes('APP_B2B_ACCOUNT_OWNER'))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.accountfacade.loadOrders({ ...this.query, allBuyers: 'true' }));

    this.accountfacade.loadOrders(this.query);
    this.orders$ = this.accountfacade.orders$;
    this.ordersLoading$ = this.accountfacade.ordersLoading$;
  }
}
