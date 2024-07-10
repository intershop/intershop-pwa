import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

/**
 * Component to display a the organization hierarchies group path on an order or basket.
 * Used in {@link BasketBuyerComponent}.
 */
@Component({
  selector: 'ish-organization-hierarchies-path',
  templateUrl: './organization-hierarchies-path.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationHierarchiesPathComponent implements OnInit {
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
