import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { LoginUser, getUserError } from 'ish-core/store/user';

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
export class LoginFormContainerComponent {
  loginError$ = this.store.pipe(select(getUserError));
  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) public userRegistrationLoginType: string,
    private store: Store<{}>
  ) {}

  loginUser(credentials: LoginCredentials) {
    this.store.dispatch(new LoginUser({ credentials }));
  }
}
