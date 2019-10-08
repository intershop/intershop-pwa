import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Account Profile Password Page Container Component renders a page where the user can change his password using the {@link AccountProfilePasswordPageComponent}
 *
 */
@Component({
  selector: 'ish-account-profile-password-page-container',
  templateUrl: './account-profile-password-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfilePasswordPageContainerComponent implements OnInit {
  userError$: Observable<HttpError>;
  userLoading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.userError$ = this.accountFacade.userError$;
    this.userLoading$ = this.accountFacade.userLoading$;
  }

  updateUserPassword(data: { password: string; currentPassword: string }) {
    this.accountFacade.updateUserPassword(data);
  }
}
