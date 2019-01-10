import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { LoginUser, getUserAuthorized, getUserError } from 'ish-core/store/user';

@Component({
  templateUrl: './login-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageContainerComponent {
  isLoggedIn$ = this.store.pipe(select(getUserAuthorized));
  loginError$ = this.store.pipe(select(getUserError));

  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) public userRegistrationLoginType: string,
    private store: Store<{}>
  ) {}

  loginUser(credentials: LoginCredentials) {
    this.store.dispatch(new LoginUser({ credentials }));
  }
}
