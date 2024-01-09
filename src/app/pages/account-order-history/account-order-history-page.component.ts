import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order History Page Component renders the account history page of a logged in user.
 *
 */
@Component({
  templateUrl: './account-order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderHistoryPageComponent implements OnInit {
  orders$: Observable<Order[]>;
  ordersLoading$: Observable<boolean>;
  ordersError$: Observable<HttpError>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.orders$ = this.accountFacade.orders$({ limit: 30, include: ['commonShipToAddress'] });
    this.ordersLoading$ = this.accountFacade.ordersLoading$;
    this.ordersError$ = this.accountFacade.ordersError$;
  }
}
