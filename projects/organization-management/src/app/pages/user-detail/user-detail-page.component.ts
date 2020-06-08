import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-detail-page',
  templateUrl: './user-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPageComponent implements OnInit {
  user$: Observable<B2bUser>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.user$ = this.organizationManagementFacade.selectedUser$;
  }
}
