import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order Page Container reads order data from store and displays them using the {@link OrderPageComponent}
 *
 */
@Component({
  selector: 'ish-account-order-page',
  templateUrl: './account-order-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderPageComponent implements OnInit {
  order$: Observable<Order>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.order$ = this.accountFacade.selectedOrder$;
  }
}
