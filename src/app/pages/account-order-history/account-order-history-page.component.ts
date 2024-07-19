import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { OrderListQuery } from 'ish-core/models/order-list-query/order-list-query.model';
import { Order } from 'ish-core/models/order/order.model';
import { OrderColumnsType } from 'ish-shared/components/order/order-list/order-list.component';

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
  columnsToDisplay$: Observable<OrderColumnsType[]>;
  moreOrdersAvailable$: Observable<boolean>;
  filtersActive: boolean;
  private isAdmin = false;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.orders$ = this.accountFacade.orders$.pipe(shareReplay(1));
    this.ordersLoading$ = this.accountFacade.ordersLoading$;
    this.ordersError$ = this.accountFacade.ordersError$;
    this.moreOrdersAvailable$ = this.accountFacade.moreOrdersAvailable$;
    this.columnsToDisplay$ = this.accountFacade.isAccountAdmin$.pipe(
      tap(isAdmin => (this.isAdmin = isAdmin)),
      map(isAdmin =>
        isAdmin
          ? ['creationDate', 'orderNoWithLink', 'lineItems', 'status', 'buyer', 'orderTotal']
          : ['creationDate', 'orderNoWithLink', 'lineItems', 'status', 'destination', 'orderTotal']
      )
    );
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
      buyer: filters.buyer || (this.isAdmin ? 'all' : undefined),
    });
  }

  loadMoreOrders(): void {
    this.accountFacade.loadMoreOrders();
  }
}
