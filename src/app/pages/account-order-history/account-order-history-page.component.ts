import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, take, tap } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { OrderListQuery } from 'ish-core/models/order-list-query/order-list-query.model';
import { Order } from 'ish-core/models/order/order.model';
import { PagingData } from 'ish-core/models/paging/paging.model';
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
  ordersForPage$: Observable<Order[]>;
  pagingData$: Observable<PagingData>;
  columnsToDisplay$: Observable<OrderColumnsType[]>;
  filtersActive: boolean;
  pageSize = 25;

  private isOrderManager = false;
  private destroyRef = inject(DestroyRef);

  private pageNumberSubject = new BehaviorSubject<number>(1);
  pageNumber$ = this.pageNumberSubject.asObservable();

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.orders$ = this.accountFacade.orders$.pipe(shareReplay(1));
    this.ordersLoading$ = this.accountFacade.ordersLoading$;
    this.ordersError$ = this.accountFacade.ordersError$;
    this.pagingData$ = this.accountFacade.ordersPagingData$;
    this.columnsToDisplay$ = this.accountFacade.isOrderManager$.pipe(
      tap(isOrderManager => (this.isOrderManager = isOrderManager)),
      map(isOrderManager =>
        isOrderManager
          ? ['creationDate', 'orderNoWithLink', 'lineItems', 'status', 'buyer', 'orderTotal']
          : ['creationDate', 'orderNoWithLink', 'lineItems', 'status', 'destination', 'orderTotal']
      )
    );
    this.getOrdersForPage();
  }

  getOrdersForPage() {
    this.ordersForPage$ = combineLatest([this.orders$, this.pageNumber$]).pipe(
      map(([orders, pageNumber]) => {
        const start = (pageNumber - 1) * this.pageSize;
        const end = start + this.pageSize;
        return orders.filter(order => order.paginationPosition >= start && order.paginationPosition < end);
      })
    );
  }

  loadFilteredOrders(filters: Partial<OrderListQuery>) {
    this.pageNumberSubject.next(1);
    this.filtersActive = Object.keys(filters).length > 0;
    this.accountFacade.loadOrders({
      ...filters,
      limit: this.pageSize,
      include: ['commonShipToAddress'],
      buyer: filters.buyer || (this.isOrderManager ? 'all' : undefined),
    });
  }

  loadMoreOrders(pageNumber: number): void {
    this.pageNumberSubject.next(pageNumber);

    this.orders$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(orders => {
      if (!orders.find(order => order.paginationPosition === (pageNumber - 1) * this.pageSize)) {
        this.accountFacade.loadMoreOrders((pageNumber - 1) * this.pageSize, this.pageSize);
      }
    });
  }

  getTotalPages(totalOrders: number) {
    return Math.ceil(totalOrders / this.pageSize);
  }
}
