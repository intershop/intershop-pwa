import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { getSelectedOrder } from '../../../core/store/orders';

/**
 * The Order Page Container reads order data from store and displays them using the {@link OrderPageComponent}
 *
 */
@Component({
  selector: 'ish-order-page-container',
  templateUrl: './order-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageContainerComponent {
  order$ = this.store.pipe(
    select(getSelectedOrder),
    filter(order => !!order)
  );

  constructor(private store: Store<{}>) {}
}
