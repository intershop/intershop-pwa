import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { CoreState } from '../../../core/store/core.state';
import { LoginUser, getUserAuthorized, getUserError } from '../../../core/store/user';
import { LoginCredentials } from '../../../models/credentials/credentials.model';
import { HttpError } from '../../../models/http-error/http-error.model';

@Component({
  templateUrl: './login-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageContainerComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  loginError$: Observable<HttpError>;

  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) public userRegistrationLoginType: string,
    private store: Store<CoreState>
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.store.pipe(select(getUserAuthorized));
    this.loginError$ = this.store.pipe(select(getUserError));
  }

  loginUser(userCredentials: LoginCredentials) {
    this.store.dispatch(new LoginUser(userCredentials));
  }
}
