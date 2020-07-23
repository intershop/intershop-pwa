import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-users-page',
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
