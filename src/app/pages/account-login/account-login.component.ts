import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountLoginService } from 'app/services/account-login';
import { EmailValidator } from 'app/validators/email.validator';
import { CacheCustomService } from 'app/services/cache/cache-custom.service';


@Component({
  templateUrl: './account-login.component.html'
})

export class AccountLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginToUse: boolean = false;
  loginFormSubmitted: boolean;
  errorUser: any;
  registrationLoginType = 'email';
  isLoggedIn;
  defaultResponse: string = '401 and Unauthorized'
  /**
   * Constructor
   * @param  {FormBuilder} privateformBuilder
   * @param  {AccountLoginService} privateaccountLoginService
   * @param  {Router} privaterouter
   */
  constructor(private formBuilder: FormBuilder, private accountLoginService: AccountLoginService,
    private router: Router, private cacheService: CacheCustomService) { }

  /**
     * Creates Login Form
     */
  ngOnInit() {
    this.isLoggedIn = this.cacheService.cacheKeyExists('userDetail');
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.compose([Validators.required,
      (this.registrationLoginType === 'email' ? EmailValidator.validate : null)])]],
      password: ['', Validators.required],
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
      this.accountLoginService.singinUser(userCredentials).subscribe(userData => {
        if (userData && typeof userData !== 'string') {
          this.router.navigate(['home']);
        } else {
          this.loginForm.get('password').reset();
          this.errorUser = userData || this.defaultResponse;
        }
      });
    }
  }
}

