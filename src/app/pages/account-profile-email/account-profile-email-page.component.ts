import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfileEmailComponent } from './account-profile-email/account-profile-email.component';

/**
 * The Account Profile Email Page Component renders a page where the user can change his email.
 */
@Component({
  selector: 'ish-account-profile-email-page',
  templateUrl: './account-profile-email-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AccountProfileEmailComponent, AsyncPipe, LoadingComponent, NgIf],
})
export class AccountProfileEmailPageComponent implements OnInit {
  currentUser$: Observable<User>;
  userError$: Observable<HttpError>;
  userLoading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.currentUser$ = this.accountFacade.user$;
    this.userError$ = this.accountFacade.userError$;
    this.userLoading$ = this.accountFacade.userLoading$;
  }

  updateUserEmail(data: { user: User; credentials: Credentials }) {
    this.accountFacade.updateUserEmail(data.user, data.credentials);
  }
}
