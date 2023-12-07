import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrderGroupPath } from '../../models/order-group-path/order-group-path.model';

@Component({
  selector: 'ish-hierarchy-path',
  templateUrl: './hierarchy-path.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HierarchyPathComponent implements OnInit {
  @Input() object: Basket | Order;

  path$: Observable<OrderGroupPath>;
  pathLoading$: Observable<boolean>;
  error$: Observable<HttpError>;

  isCollapsed = false;

  constructor(private organizationHierarchiesFacade: OrganizationHierarchiesFacade) {}

  ngOnInit() {
    if (this.object.hasOwnProperty('documentNo')) {
      this.path$ = this.organizationHierarchiesFacade.getDetailsOfOrderGroupPath$((this.object as Order).documentNo);
    } else {
      this.path$ = this.organizationHierarchiesFacade.getDetailsOfBasketGroupPath$();
    }
    this.pathLoading$ = this.organizationHierarchiesFacade.orderGroupPathLoading$;
    this.error$ = this.organizationHierarchiesFacade.orderGroupPathLoadingError$;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
