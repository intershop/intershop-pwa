import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizationManagementFacade } from '../../../facades/organization-management.facade';
import { B2bRole } from '../../../models/b2b-role/b2b-role.model';

@Component({
  selector: 'ish-user-roles-badges',
  templateUrl: './user-roles-badges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRolesBadgesComponent implements OnChanges {
  @Input() roleIDs: string[];

  roles$: Observable<B2bRole[]>;

  constructor(private facade: OrganizationManagementFacade) {}

  ngOnChanges() {
    if (this.roleIDs) {
      this.roles$ = this.facade.roles$(this.roleIDs);
    }
  }
}
