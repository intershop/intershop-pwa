import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { EmailValidator } from '../../../validators/email.validator';
import { matchOtherValidator } from '../../../validators/match-words.validator';
import { PasswordValidator } from '../../../validators/password.validator';
import { SimpleRegistrationService } from './simple-registration.service';

@Component({
  selector: 'is-simple-registration',
  templateUrl: './simple-registration.component.html',
  providers: [SimpleRegistrationService]
})

export class SimpleRegistrationComponent implements OnInit {
  simpleRegistrationForm: FormGroup;
  userRegistrationLoginType: string;
  errorUser: string;
  isDirty: boolean;

  /**
   * Constructor
   * @param  {FormBuilder} privateformBuilder
   * @param  {AccountLoginService} privateaccountLoginService
   * @param  {Router} privaterouter
   */
  constructor(private formBuilder: FormBuilder,
    private localize: LocalizeRouterService,
    private router: Router,
    private globalConfiguration: GlobalConfiguration,
    private simpleRegistrationService: SimpleRegistrationService) { }

  /**
     * Creates Login Form
     */
  ngOnInit() {
    this.globalConfiguration.getApplicationSettings().subscribe(data => {
      this.userRegistrationLoginType = data ? data.userRegistrationLoginType : 'email';
      this.simpleRegistrationForm = this.formBuilder.group({
        userName: ['', [Validators.compose([Validators.required,
        (this.userRegistrationLoginType === 'email' ? EmailValidator.validate : null)])]],
        password: ['', [Validators.required, Validators.minLength(7), PasswordValidator.validate]],
        confirmPassword: ['', [Validators.required,
        matchOtherValidator('password')]]
      });
    });
  }


  createAccount(userData) {
    if (this.simpleRegistrationForm.invalid) {
      Object.keys(this.simpleRegistrationForm.controls).forEach(key => {
        this.simpleRegistrationForm.get(key).markAsDirty();
      });
      this.isDirty = true;
    } else {
      this.simpleRegistrationService.createUser(userData as UserDetail).subscribe(response => {
        if (response) {
          this.router.navigate([this.localize.translateRoute('/home')]);
        }
      });
    }
  }
}

