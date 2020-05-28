import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-users-page',
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .container {
        padding: 0;
      }
    `,
  ],
})
export class UsersPageComponent implements OnInit {
  users$: Observable<User[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.users$ = this.organizationManagementFacade.users$();
    this.error$ = this.organizationManagementFacade.usersError$;
    this.loading$ = this.organizationManagementFacade.usersLoading$;
  }

  deleteUser(user) {
    // tslint:disable-next-line:no-console
    console.log('### deleteUser', user);
  }
}
