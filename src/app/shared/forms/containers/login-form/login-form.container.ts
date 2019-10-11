import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Login Form Page Container displays a login form using the {@link LoginFormComponent} and signs the user in
 * Set the Url query parameter returnUrl as page Url after successful Logging in, e.g.
 * <a
    routerLink="/login"
    [queryParams]="{ returnUrl: '/account' }"
    class="my-account-link my-account-login"
    rel="nofollow"
  >
 *
 * @example:
 * <ish-login-form-container></ish-login-form-container>
 */
@Component({
  selector: 'ish-login-form-container',
  templateUrl: './login-form.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormContainerComponent implements OnInit {
  loginError$: Observable<HttpError>;
  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) public userRegistrationLoginType: string,
    private accountFacade: AccountFacade
  ) {}

  ngOnInit() {
    this.loginError$ = this.accountFacade.userError$;
  }

  loginUser(credentials: LoginCredentials) {
    this.accountFacade.loginUser(credentials);
  }
}
