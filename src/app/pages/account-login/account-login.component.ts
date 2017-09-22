import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfiguration } from '../../configurations/global.configuration';
import { AccountLoginService } from '../../services/account-login';
import { UserDetail } from '../../services/account-login/account-login.model';
import { CacheCustomService } from '../../services/cache/cache-custom.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { CustomValidations } from "../../validators/custom.validations";

@Component({
  templateUrl: './account-login.component.html'
})

export class AccountLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginToUse = false;
  loginFormSubmitted: boolean;
  errorUser: any;
  userRegistrationLoginType: string;
  isLoggedIn;
  useSimpleAccount: boolean;
  isDirty: boolean;
  restError: string;
  /**
   * Constructor
   * @param  {FormBuilder} privateformBuilder
   * @param  {AccountLoginService} privateaccountLoginService
   * @param  {Router} privaterouter
   */
  constructor(private formBuilder: FormBuilder, private accountLoginService: AccountLoginService,
    private router: Router, private cacheService: CacheCustomService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private globalConfiguration: GlobalConfiguration,
    private localizeRouterService: LocalizeRouterService
  ) { }

  /**
     * Creates Login Form
     */
  ngOnInit() {
    this.isLoggedIn = this.cacheService.cacheKeyExists('userDetail');
    this.globalConfiguration.getApplicationSettings().subscribe(data => {
      if (data) {
        this.useSimpleAccount = data.useSimpleAccount;
        this.userRegistrationLoginType = data.userRegistrationLoginType;
      }
      this.loginForm = this.formBuilder.group({
        userName: ['', [Validators.compose([Validators.required, (this.userRegistrationLoginType === 'email' ? CustomValidations.emailValidate : null)])]],
        password: ['', [Validators.compose([Validators.required, Validators.minLength(7),
        Validators.maxLength(256), CustomValidations.passwordValidate])]]
      });
    });

  }


  /**
   * Routes to Family Page when user is logged in
   */
  onSignin(userCredentials) {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key).markAsDirty();
      });
      this.isDirty = true;
    } else {
      this.loginFormSubmitted = true;
      this.accountLoginService.singinUser(userCredentials).subscribe((userData: UserDetail) => {
        if (typeof(userData) === 'object') {
          this.router.navigate([this.localizeRouterService.translateRoute('/home')]);
        } else {
          this.loginForm.get('password').reset();
          this.errorUser = userData;
        }
      });
    }
  }
}
