import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

@Component({
  selector: 'ish-hierarchies-page',
  templateUrl: './account-hierarchies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHierarchiesPageComponent implements OnInit {
  groups: OrganizationGroup[];
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private organizationHierarchiesFacade: OrganizationHierarchiesFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationHierarchiesFacade.groupsLoading$;
    this.error$ = this.organizationHierarchiesFacade.groupsError$;
  }
}
