// NEEDS_WORK: remove coupling of login and simple registration?
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { AccountLogin } from '../../../core/services/account-login/account-login.model';
import { CoreState, getLoginError, getUserAuthorized, LoginUser } from '../../../core/store/user';

@Component({
  templateUrl: './login-page.container.html'
})

export class LoginPageComponent implements OnInit {

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
    this.loginError$ = this.store.pipe(select(getLoginError));
  }

  loginUser(userCredentials: AccountLogin) {
    this.store.dispatch(new LoginUser(userCredentials));
  }
}
