import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getSelectedOrder } from '../../../core/store/orders';
import { getLoggedInUser } from '../../../core/store/user';
import { getBasketLoading } from '../../store/basket';

@Component({
  selector: 'ish-checkout-receipt-page-container',
  templateUrl: './checkout-receipt-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptPageContainerComponent {
  order$ = this.store.pipe(select(getSelectedOrder));
  /* ToDo: User data should be available by the Order, see #IS-17616 */
  user$ = this.store.pipe(select(getLoggedInUser));
  loading$ = this.store.pipe(select(getBasketLoading));

  constructor(private store: Store<{}>) {}
}
