import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from 'ish-core/models/user/user.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-users-detail-page',
  templateUrl: './users-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDetailPageComponent implements OnInit {
  user$: Observable<User>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.user$ = this.organizationManagementFacade.selectedUser$;
  }
}
