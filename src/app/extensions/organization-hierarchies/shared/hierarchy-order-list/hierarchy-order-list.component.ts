import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

@Component({
  selector: 'ish-hierarchy-order-list',
  templateUrl: './hierarchy-order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HierarchyOrderListComponent extends OrderListComponent implements OnInit {
  orders$: Observable<Order[]>;
  ordersLoading$: Observable<boolean>;
  ordersError$: Observable<HttpError>;

  constructor(private accountFacade: AccountFacade, private facade: OrganizationHierarchiesFacade) {
    super();
  }

  ngOnInit() {
    this.orders$ = this.facade.orders$({ limit: 30 });
    this.ordersLoading$ = this.accountFacade.ordersLoading$;
    this.ordersError$ = this.accountFacade.ordersError$;
  }
}
