import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-users-detail-page',
  templateUrl: './users-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDetailPageComponent implements OnInit {
  user$: Observable<B2bUser>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.user$ = this.organizationManagementFacade.selectedUser$;
  }
}
