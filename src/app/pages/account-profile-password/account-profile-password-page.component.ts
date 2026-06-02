import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfilePasswordComponent } from './account-profile-password/account-profile-password.component';

/**
 * The Account Profile Password Page Component renders a page where the user can change his password.
 *
 */
@Component({
  selector: 'ish-account-profile-password-page',
  templateUrl: './account-profile-password-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AccountProfilePasswordComponent, AsyncPipe, LoadingComponent],
})
export class AccountProfilePasswordPageComponent implements OnInit {
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
