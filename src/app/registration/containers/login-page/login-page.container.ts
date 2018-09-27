import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { LoginUser, getUserAuthorized, getUserError } from '../../../core/store/user';
import { LoginCredentials } from '../../../models/credentials/credentials.model';

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

  loginUser(userCredentials: LoginCredentials) {
    this.store.dispatch(new LoginUser(userCredentials));
  }
}
