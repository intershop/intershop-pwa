import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CoreState } from '../../../core/store/core.state';
import { LoadOrders, getOrders, getOrdersLoading } from '../../../core/store/orders';
import { Order } from '../../../models/order/order.model';

@Component({
  templateUrl: './order-history-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryPageContainerComponent implements OnInit {
  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.store.dispatch(new LoadOrders());

    this.orders$ = this.store.pipe(select(getOrders));
    this.loading$ = this.store.pipe(select(getOrdersLoading));
  }
}
