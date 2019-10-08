import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { OrderView } from 'ish-core/models/order/order.model';

/**
 * The Order Page Container reads order data from store and displays them using the {@link OrderPageComponent}
 *
 */
@Component({
  selector: 'ish-account-order-page-container',
  templateUrl: './account-order-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderPageContainerComponent implements OnInit {
  order$: Observable<OrderView>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.order$ = this.accountFacade.selectedOrder$;
  }
}
