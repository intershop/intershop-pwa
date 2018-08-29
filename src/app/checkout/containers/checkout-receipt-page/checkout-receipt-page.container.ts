import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CoreState } from '../../../core/store/core.state';
import { getSelectedOrder } from '../../../core/store/orders';
import { getLoggedInUser } from '../../../core/store/user';
import { Order } from '../../../models/order/order.model';
import { User } from '../../../models/user/user.model';
import { getBasketLoading } from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-checkout-receipt-page-container',
  templateUrl: './checkout-receipt-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptPageContainerComponent implements OnInit {
  order$: Observable<Order>;
  user$: Observable<User>; /* ToDo: User data should be available by the Order, see #IS-17616 */
  loading$: Observable<boolean>;

  constructor(private store: Store<CheckoutState | CoreState>) {}

  ngOnInit() {
    this.order$ = this.store.pipe(select(getSelectedOrder));
    this.user$ = this.store.pipe(select(getLoggedInUser));
    this.loading$ = this.store.pipe(select(getBasketLoading));
  }
}
