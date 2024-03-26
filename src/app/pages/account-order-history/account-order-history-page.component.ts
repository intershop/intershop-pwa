import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { OrderListQuery } from 'ish-core/models/order-list-query/order-list-query.model';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order History Page Component renders the account history page of a logged in user.
 *
 * If search results have no order, filters should be rendered
 * If no order placed yet, filters should not be rendered
 */
@Component({
  templateUrl: './account-order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderHistoryPageComponent implements OnInit {
  orders$: Observable<Order[]>;
  ordersLoading$: Observable<boolean>;
  ordersError$: Observable<HttpError>;
  moreOrdersAvailable$: Observable<boolean>;
  filtersActive: boolean;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.orders$ = this.accountFacade.orders$.pipe(shareReplay(1));
    this.ordersLoading$ = this.accountFacade.ordersLoading$;
    this.ordersError$ = this.accountFacade.ordersError$;
    this.moreOrdersAvailable$ = this.accountFacade.moreOrdersAvailable$;
  }

  /**
   * Load filtered orders
   *
   */
  loadFilteredOrders(filters: Partial<OrderListQuery>) {
    this.filtersActive = Object.keys(filters).length > 0;
    this.accountFacade.loadOrders({
      ...filters,
      limit: 30,
      include: ['commonShipToAddress'],
    });
  }

  loadMoreOrders(): void {
    this.accountFacade.loadMoreOrders();
  }
}
