import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CoreState } from '../../../core/store/core.state';
import { LoadOrders, getOrders, getOrdersLoading } from '../../../core/store/orders';
import { getLoggedInUser } from '../../../core/store/user';
import { OrderView } from '../../../models/order/order.model';
import { User } from '../../../models/user/user.model';

@Component({
  templateUrl: './account-overview-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewPageContainerComponent implements OnInit {
  user$: Observable<User>;
  orders$: Observable<OrderView[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));

    this.store.dispatch(new LoadOrders());

    this.orders$ = this.store.pipe(select(getOrders));
    this.loading$ = this.store.pipe(select(getOrdersLoading));
  }
}
