import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { BudgetInfoComponent } from '../../components/budget-info/budget-info.component';
import { UserBudgetComponent } from '../../components/user-budget/user-budget.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { UserRolesBadgesComponent } from './user-roles-badges/user-roles-badges.component';

@Component({
  selector: 'ish-users-page',
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    BudgetInfoComponent,
    ErrorMessageComponent,
    LoadingComponent,
    ModalDialogComponent,
    NgFor,
    NgIf,
    RouterModule,
    ServerSettingPipe,
    TranslatePipe,
    UserBudgetComponent,
    UserRolesBadgesComponent,
  ],
})
export class UsersPageComponent implements OnInit {
  currentUser$: Observable<User>;
  users$: Observable<B2bUser[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(
    private organizationManagementFacade: OrganizationManagementFacade,
    private accountFacade: AccountFacade
  ) {}

  ngOnInit() {
    this.users$ = this.organizationManagementFacade.users$;
    this.error$ = this.organizationManagementFacade.usersError$;
    this.loading$ = this.organizationManagementFacade.usersLoading$;

    this.currentUser$ = this.accountFacade.user$;
  }

  deleteUser(user: B2bUser) {
    this.organizationManagementFacade.deleteUser(user.login);
  }
}
