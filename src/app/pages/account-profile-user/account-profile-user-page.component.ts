import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Profile User Page Component renders a page where the user can change his profile data.
 */
@Component({
  selector: 'ish-account-profile-user-page',
  templateUrl: './account-profile-user-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileUserPageComponent implements OnInit {
  currentUser$: Observable<User>;
  userError$: Observable<HttpError>;
  userLoading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.currentUser$ = this.accountFacade.user$;
    this.userError$ = this.accountFacade.userError$;
    this.userLoading$ = this.accountFacade.userLoading$;
  }

  updateUserProfile(user: User) {
    this.accountFacade.updateUserProfile(user);
  }
}
