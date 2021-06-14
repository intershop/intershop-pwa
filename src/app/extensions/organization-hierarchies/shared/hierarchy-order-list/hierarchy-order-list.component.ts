import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

@Component({
  selector: 'ish-hierarchy-order-list',
  templateUrl: '../../../../../app/shared/components/order/order-list/order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HierarchyOrderListComponent extends OrderListComponent implements OnInit {
  constructor(private facade: OrganizationHierarchiesFacade, protected accountFacade: AccountFacade) {
    super(accountFacade);
  }

  ngOnInit() {
    this.orders$ = this.facade.orders$();
    this.loading$ = this.accountFacade.ordersLoading$;
  }
}
