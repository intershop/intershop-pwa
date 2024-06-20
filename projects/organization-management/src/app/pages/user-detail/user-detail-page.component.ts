import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { B2bRole } from 'ish-core/models/b2b-role/b2b-role.model';
import { B2bUser } from 'ish-core/models/b2b-user/b2b-user.model';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-user-detail-page',
  templateUrl: './user-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPageComponent implements OnInit {
  user$: Observable<B2bUser>;
  roles$: Observable<B2bRole[]>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.user$ = this.organizationManagementFacade.selectedUser$;

    const roleIDs$ = this.user$.pipe(mapToProperty('roleIDs'), whenTruthy());

    this.roles$ = this.organizationManagementFacade.roles$(roleIDs$);
  }
}
