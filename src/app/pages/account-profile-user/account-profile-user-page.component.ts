import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfileUserComponent } from './account-profile-user/account-profile-user.component';

/**
 * The Account Profile User Page Component renders a page where the user can change his profile data.
 */
@Component({
  selector: 'ish-account-profile-user-page',
  imports: [AccountProfileUserComponent, AsyncPipe, LoadingComponent],
  standalone: true,
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
