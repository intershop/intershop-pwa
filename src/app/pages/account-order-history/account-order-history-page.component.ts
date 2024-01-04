import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
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

  constructor(private accountfacade: AccountFacade) {}

  ngOnInit(): void {
    this.orders$ = this.accountfacade.orders$({ limit: 30, include: ['commonShipToAddress'] });
    this.ordersLoading$ = this.accountfacade.ordersLoading$;
  }
}
