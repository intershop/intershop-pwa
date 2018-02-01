// NEEDS_WORK: remove coupling of login and simple registration?
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { FormUtilsService } from '../../../core/services/utils/form-utils.service';
import { Customer } from '../../../models/customer/customer.model';

@Component({
  templateUrl: './login-page.component.html'
})

export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loginToUse = false;
  errorUser: any;
  isLoggedIn: boolean;
  isDirty: boolean;
  isSimpleRegistration: boolean;

  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) public userRegistrationLoginType: string,
    private formBuilder: FormBuilder,
    private accountLoginService: AccountLoginService,
    private router: Router,
    private formUtils: FormUtilsService
  ) { }

  /**
   * Creates Login Form
   */
  ngOnInit() {
    this.accountLoginService.subscribe(() => {
      this.isLoggedIn = this.accountLoginService.isAuthorized();
    });

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.compose([Validators.required, (this.userRegistrationLoginType === 'email' ? CustomValidators.email : Validators.nullValidator)])]],
      password: ['', Validators.required]
    });

    if (this.router.url.indexOf('register') > -1) {
      this.isSimpleRegistration = true;
    }
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
    this.accountLoginService.signinUser(userCredentials).subscribe((userData: Customer) => {
      if (typeof (userData) !== 'object') {
        this.loginForm.get('password').reset();
        this.errorUser = userData;
        return;
      }
      this.router.navigate(['/account']);
    });
  }
}
