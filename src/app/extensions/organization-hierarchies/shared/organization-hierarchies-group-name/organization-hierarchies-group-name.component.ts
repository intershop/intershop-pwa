import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';

/**
 * Component to display the name of an organization hierarchies group for an order.
 * Used in {@link OrderListComponent}.
 */
@Component({
  selector: 'ish-organization-hierarchies-group-name',
  templateUrl: './organization-hierarchies-group-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationHierarchiesGroupNameComponent implements OnInit {
  @Input() buyingContext: string;
  @Input() showLabel: boolean;
  group$: Observable<OrganizationHierarchiesGroup>;

  constructor(private facade: OrganizationHierarchiesFacade) {}

  ngOnInit() {
    if (this.buyingContext) {
      this.group$ = this.facade.getDetailsOfGroup$(this.buyingContext.split('@')[0]);
    }
  }
}
