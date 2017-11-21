import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { GlobalConfiguration } from '../../../core/configurations/global.configuration';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { UserDetail } from '../../../models/account-login.model';
@Component({
  templateUrl: './account-login.component.html'
})

export class AccountLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginToUse = false;
  errorUser: any;
  userRegistrationLoginType: string;
  isLoggedIn: boolean;
  isDirty: boolean;
  isSimpleRegistration: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private accountLoginService: AccountLoginService,
    private globalConfiguration: GlobalConfiguration,
    private router: Router
  ) { }

  /**
   * Creates Login Form
   */
  ngOnInit() {
    this.accountLoginService.subscribe(() => {
      this.isLoggedIn = this.accountLoginService.isAuthorized();
    });

    this.globalConfiguration.getApplicationSettings().subscribe(data => {
      if (data) {
        this.userRegistrationLoginType = data.userRegistrationLoginType;
      }
      this.loginForm = this.formBuilder.group({
        userName: ['', [Validators.compose([Validators.required, (this.userRegistrationLoginType === 'email' ? CustomValidators.email : Validators.nullValidator)])]],
        password: ['', Validators.required]
      });
    });

    if (this.router.url.indexOf('register') > -1) {
      this.isSimpleRegistration = true;
    }
  }


  /**
   * Redirects to Home Page when user is logged in successfully
   */
  onSignin(userCredentials) {
    if (this.loginForm.invalid) {
      this.isDirty = true;
      return;
    }
    this.accountLoginService.singinUser(userCredentials).subscribe((userData: UserDetail) => {
      if (typeof (userData) !== 'object') {
        this.loginForm.get('password').reset();
        this.errorUser = userData;
        return;
      }
      this.router.navigate(['/home']);
    });
  }
}
