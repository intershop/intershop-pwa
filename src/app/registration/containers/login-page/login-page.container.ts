// NEEDS_WORK: remove coupling of login and simple registration?
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { AccountLogin } from '../../../core/services/account-login/account-login.model';
import { CoreState } from '../../../core/store/core.state';
import { getUserAuthorized, getUserError, LoginUser } from '../../../core/store/user';

@Component({
  templateUrl: './login-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LoginPageContainerComponent implements OnInit {

  loginToUse = false;
  loginError$: Observable<HttpErrorResponse>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) public userRegistrationLoginType: string,
    private store: Store<CoreState>
  ) { }

  /**
   * Creates Login Form
   */
  ngOnInit() {
    this.isLoggedIn$ = this.store.pipe(select(getUserAuthorized));
    this.loginError$ = this.store.pipe(select(getUserError));
  }

  loginUser(userCredentials: AccountLogin) {
    this.store.dispatch(new LoginUser(userCredentials));
  }
}
