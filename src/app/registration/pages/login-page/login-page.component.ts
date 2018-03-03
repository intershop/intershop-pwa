// NEEDS_WORK: remove coupling of login and simple registration?
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { CustomValidators } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { USE_SIMPLE_ACCOUNT, USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { CoreState, getLoginError, getUserAuthorized, LoginUser } from '../../../core/store/user';
import { markAsDirtyRecursive } from '../../../utils/form-utils';

@Component({
  templateUrl: './login-page.component.html'
})

export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loginToUse = false;
  loginError$: Observable<HttpErrorResponse>;
  isLoggedIn$: Observable<boolean>;
  isDirty: boolean;

  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) public userRegistrationLoginType: string,
    @Inject(USE_SIMPLE_ACCOUNT) public isSimpleRegistration: boolean,
    private formBuilder: FormBuilder,
    private store: Store<CoreState>
  ) { }

  /**
   * Creates Login Form
   */
  ngOnInit() {
    this.isLoggedIn$ = this.store.pipe(select(getUserAuthorized));
    this.loginError$ = this.store.pipe(select(getLoginError));

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.compose([Validators.required, (this.userRegistrationLoginType === 'email' ? CustomValidators.email : Validators.nullValidator)])]],
      password: ['', Validators.required]
    });
  }


  /**
   * Redirects to Account Page when user is logged in successfully
   */
  onSignin(userCredentials) {
    if (this.loginForm.invalid) {
      this.isDirty = true;
      markAsDirtyRecursive(this.loginForm);
      return;
    }
    this.store.dispatch(new LoginUser(userCredentials));
  }
}
