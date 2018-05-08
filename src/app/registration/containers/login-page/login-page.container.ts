import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { CoreState } from '../../../core/store/core.state';
import { getUserAuthorized, getUserError, LoginUser } from '../../../core/store/user';
import { LoginCredentials } from '../../../models/credentials/credentials.model';

@Component({
  templateUrl: './login-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageContainerComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  loginError$: Observable<HttpErrorResponse>;

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
