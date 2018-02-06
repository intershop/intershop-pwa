// NEEDS_WORK: remove coupling of login and simple registration?
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CustomValidators } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { USE_SIMPLE_ACCOUNT, USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { FormUtilsService } from '../../../core/services/utils/form-utils.service';
import { getLoginError, getUserAuthorized, LoginUser, State } from '../../../core/store';

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
    private formUtils: FormUtilsService,
    private store: Store<State>
  ) { }

  /**
   * Creates Login Form
   */
  ngOnInit() {
    this.isLoggedIn$ = this.store.select(getUserAuthorized);
    this.loginError$ = this.store.select(getLoginError);

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
      this.formUtils.markAsDirtyRecursive(this.loginForm);
      return;
    }
    this.store.dispatch(new LoginUser(userCredentials));
  }
}
