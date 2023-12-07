import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

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
  private facade = inject(OrganizationHierarchiesFacade);

  ngOnInit() {
    this.orders$ = this.facade.orders$();
    this.loading$ = this.accountFacade.ordersLoading$;
  }
}
