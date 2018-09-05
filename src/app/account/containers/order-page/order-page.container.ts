import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { getSelectedOrder } from '../../../core/store/orders';
import { OrderView } from '../../../models/order/order.model';

/**
 * The Order Page Container reads order data from store and displays them using the {@link OrderPageComponent}
 *
 */
@Component({
  selector: 'ish-order-page-container',
  templateUrl: './order-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageContainerComponent implements OnInit {
  order$: Observable<OrderView>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.order$ = this.store.pipe(
      select(getSelectedOrder),
      filter(order => !!order)
    );
  }
}
