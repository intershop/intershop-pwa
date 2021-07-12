import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Order } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-spa-checkout-receipt-page',
  templateUrl: './spa-checkout-receipt-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaCheckoutReceiptPageComponent implements OnInit {
  order$: Observable<Order>;
  loading$: Observable<boolean>;
  /** ToDo: User data should be available by the Order, see #IS-17616 */
  user$: Observable<User>;

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.order$ = this.checkoutFacade.selectedOrder$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.user$ = this.accountFacade.user$;
  }
}
