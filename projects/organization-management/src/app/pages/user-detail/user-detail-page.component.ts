import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bRole } from '../../models/b2b-role/b2b-role.model';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserDetailBudgetComponent } from './user-detail-budget/user-detail-budget.component';

@Component({
  selector: 'ish-user-detail-page',
  templateUrl: './user-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ServerSettingPipe, TranslatePipe, UserDetailBudgetComponent, RouterLink],
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
