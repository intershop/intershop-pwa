import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { OrderView } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-checkout-receipt-page-container',
  templateUrl: './checkout-receipt-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptPageContainerComponent implements OnInit {
  order$: Observable<OrderView>;
  loading$: Observable<boolean>;
  /* ToDo: User data should be available by the Order, see #IS-17616 */
  user$: Observable<User>;

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.order$ = this.checkoutFacade.selectedOrder$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.user$ = this.accountFacade.user$;
  }
}
