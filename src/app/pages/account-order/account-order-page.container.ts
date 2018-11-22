import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getSelectedOrder } from 'ish-core/store/orders';

/**
 * The Order Page Container reads order data from store and displays them using the {@link OrderPageComponent}
 *
 */
@Component({
  selector: 'ish-account-order-page-container',
  templateUrl: './account-order-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderPageContainerComponent {
  order$ = this.store.pipe(select(getSelectedOrder));

  constructor(private store: Store<{}>) {}
}
