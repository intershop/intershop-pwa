import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrganizationHierarchiesFacade } from '../../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../../models/organization-group/organization-group.model';

/**
 * The Account Address Page Component displays the preferred InvoiceTo and ShipTo addresses of the user
 * and any further addresses. The user can add and delete addresses. It is mandatory to have at least one address.
 */
@Component({
  selector: 'ish-account-hierarchies',
  templateUrl: './account-hierarchies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHierarchiesComponent implements OnInit {
  @Input() error: HttpError;
  groups$: Observable<OrganizationGroup[]>;
  isCreateGroupFormCollapsed = true;

  constructor(private organizationHierarchiesFacade: OrganizationHierarchiesFacade) {}
  ngOnInit(): void {
    this.groups$ = this.organizationHierarchiesFacade.groups$;
  }

  createGroup(data: { parentGroupId: string; child: OrganizationGroup }) {
    this.organizationHierarchiesFacade.createAndAddGroup(data.parentGroupId, data.child);
    this.hideCreateGroupForm();
  }

  showCreateGroupForm() {
    this.isCreateGroupFormCollapsed = false;
  }

  hideCreateGroupForm() {
    this.isCreateGroupFormCollapsed = true;
  }
}
