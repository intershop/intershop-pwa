import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Profile Username Page Component renders a page where the user can change his username.
 */
@Component({
  selector: 'ish-account-profile-username-page',
  standalone: false,
  templateUrl: './account-profile-username-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileUsernamePageComponent implements OnInit {
  currentUser$: Observable<User>;
  userError$: Observable<HttpError>;
  userLoading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.currentUser$ = this.accountFacade.user$;
    this.userError$ = this.accountFacade.userError$;
    this.userLoading$ = this.accountFacade.userLoading$;
  }

  updateUserName(data: { user: User; credentials: Credentials }) {
    this.accountFacade.updateUserName(data.user, data.credentials);
  }
}
