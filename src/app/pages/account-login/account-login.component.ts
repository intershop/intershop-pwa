import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConfiguration } from '../../configurations/global.configuration';
import { AccountLoginService } from '../../services/account-login';
import { UserDetail } from '../../services/account-login/account-login.model';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { CustomValidators } from 'ng2-validation';
@Component({
  templateUrl: './account-login.component.html'
})

export class AccountLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginToUse = false;
  errorUser: any;
  userRegistrationLoginType: string;
  isLoggedIn: boolean;
  useSimpleAccount: boolean;
  isDirty: boolean;
  isSimpleRegistration: boolean;

  constructor(private formBuilder: FormBuilder,
    private accountLoginService: AccountLoginService,
    private globalConfiguration: GlobalConfiguration,
    private localizeRouterService: LocalizeRouterService) {

    accountLoginService.subscribe(() => {
      this.isLoggedIn = this.accountLoginService.isAuthorized();
    });
  }

  /**
   * Creates Login Form
   */
  ngOnInit() {
    this.globalConfiguration.getApplicationSettings().subscribe(data => {
      if (data) {
        this.useSimpleAccount = data.useSimpleAccount;
        this.userRegistrationLoginType = data.userRegistrationLoginType;
      }
      this.loginForm = this.formBuilder.group({
        userName: ['', [Validators.compose([Validators.required, (this.userRegistrationLoginType === 'email' ? CustomValidators.email : null)])]],
        password: ['', [Validators.compose([Validators.required, Validators.minLength(7),
        Validators.maxLength(256), Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$/)])]]
      });
    });

  }


  /**
   * Routes to Family Page when user is logged in
   */
  onSignin(userCredentials) {
    if (this.loginForm.valid) {
      this.accountLoginService.singinUser(userCredentials).subscribe((userData: UserDetail) => {
        if (typeof (userData) === 'object') {
          this.localizeRouterService.navigateToRoute('/home');
        } else {
          this.loginForm.get('password').reset();
          this.errorUser = userData;
        }
      });
    } else {
      this.isDirty = true;
    }
  }

  createAccount() {
    if (this.useSimpleAccount) {
      this.isSimpleRegistration = this.useSimpleAccount;
    }
    else {
      this.localizeRouterService.navigateToRoute('/register');
    }
  }
}
