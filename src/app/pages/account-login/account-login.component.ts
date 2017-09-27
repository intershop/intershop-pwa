import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConfiguration } from '../../configurations/global.configuration';
import { AccountLoginService } from '../../services/account-login';
import { UserDetail } from '../../services/account-login/account-login.model';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { CustomValidators } from 'ng2-validation';
import { ActivatedRoute, Router } from '@angular/router';
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
    private localizeRouterService: LocalizeRouterService,
    private route: Router) {

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
        password: ['', Validators.required]
      });
    });
    if (this.route.url.indexOf('register') > -1) {
      this.isSimpleRegistration = true;
    }
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
}
