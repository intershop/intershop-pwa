import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationHierarchiesFacade } from '../../../facades/organization-hierarchies.facade';

@Component({
  selector: 'ish-hierarchy-path',
  templateUrl: './hierarchy-path.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HierarchyPathComponent implements OnInit {
  @Input() object: Basket | Order;

  pathArray$: Observable<string[]>;
  isCollapsed = false;

  constructor(private organizationHierarchiesFacade: OrganizationHierarchiesFacade) {}

  ngOnInit() {
    const groupId = this.object.buyingContext.split('@')[0];
    this.pathArray$ = this.organizationHierarchiesFacade.determineGroupPath(groupId);
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
