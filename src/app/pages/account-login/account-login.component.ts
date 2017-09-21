import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AccountLoginService } from "../../services/account-login/account-login.service";
import { CacheCustomService } from "../../services/index";
import { CustomValidations } from "../../validators/custom.validations";
import { UserDetail } from "../../services/account-login/account-login.model";
import { ErrorCodeMappingService } from "../../services/error-code-mapping.service";
import { FormControlMessages } from "../../components/form-control-messages";
@Component({
  templateUrl: './account-login.component.html',
  providers: [ErrorCodeMappingService],
  entryComponents: [FormControlMessages],
})

export class AccountLoginComponent implements OnInit {
  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;
  loginForm: FormGroup;
  loginToUse = false;
  loginFormSubmitted: boolean;
  errorUser: any;
  registrationLoginType = 'email';
  isLoggedIn;
  defaultResponse = '401 and Unauthorized';
  restError: string;
  /**
   * Constructor
   * @param  {FormBuilder} privateformBuilder
   * @param  {AccountLoginService} privateaccountLoginService
   * @param  {Router} privaterouter
   */
  constructor(private formBuilder: FormBuilder, private accountLoginService: AccountLoginService,
    private router: Router, private cacheService: CacheCustomService,
    private errorCodeMappingService: ErrorCodeMappingService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  /**
     * Creates Login Form
     */
  ngOnInit() {
    this.isLoggedIn = this.cacheService.cacheKeyExists('userDetail');
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.compose([Validators.required, (this.registrationLoginType === 'email' ?  CustomValidations.emailValidate : null)])]],
      password: ['', [Validators.compose([Validators.required, Validators.minLength(7),
      Validators.maxLength(256), CustomValidations.passwordValidate])]]

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
    } else {
      this.loginFormSubmitted = true;
      this.accountLoginService.singinUser(userCredentials).subscribe((userData: UserDetail | any) => {
        if (userData instanceof UserDetail) {
          this.router.navigate(['home']);
        } else {
          this.loginForm.get('password').reset();
          this.errorUser = this.defaultResponse || userData;
          this.restError = this.errorCodeMappingService.getErrorMapping(userData);
          this.loadCustomError(this.restError, userData.fieldName);
        }
      });
    }
  }

  loadCustomError(errorMessage, fieldName) {
    let passwordControl: FormControl = <FormControl>this.loginForm.controls[fieldName];
    passwordControl.markAsDirty();
    passwordControl.setErrors({ "customError": errorMessage });

  }
}

