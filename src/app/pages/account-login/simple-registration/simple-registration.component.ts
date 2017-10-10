import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-simple-registration',
  templateUrl: './simple-registration.component.html'
})

export class SimpleRegistrationComponent implements OnInit {
  simpleRegistrationForm: FormGroup;
  isUsername: boolean;
  errorUser: string;
  isInvalid: boolean;

  /**
   * Constructor
   * @param {FormBuilder} formBuilder
   * @param {LocalizeRouterService} localize
   * @param {GlobalConfiguration} globalConfiguration
   * @param {SimpleRegistrationService} simpleRegistrationService
   */
  constructor(private formBuilder: FormBuilder,
    private localizeRouter: LocalizeRouterService,
    private globalConfiguration: GlobalConfiguration,
    private accountLoginService: AccountLoginService) {
  }

  /**
     * Creates Login Form
     */
  ngOnInit() {
    this.globalConfiguration.getApplicationSettings().subscribe(data => {
      this.isUsername = data.userRegistrationLoginType === 'username';
      const password = new FormControl('', [Validators.required, Validators.minLength(7), Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$/)]);
      const confirmPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);
      this.simpleRegistrationForm = this.formBuilder.group({
        userName: ['', Validators.compose([this.isUsername ? Validators.required : Validators.nullValidator])],
        email: ['', [Validators.required, CustomValidators.email]],
        password: password,
        confirmPassword: confirmPassword
      });
    });

    this.simpleRegistrationForm.valueChanges.subscribe(value => {
      this.isInvalid = false;
      Object.keys(this.simpleRegistrationForm.controls).forEach(key => {
        if (this.simpleRegistrationForm.get(key).dirty && this.simpleRegistrationForm.get(key).invalid) {
          this.isInvalid = true;
        }
      });
    });
  }

  createAccount(userData) {
    if (this.simpleRegistrationForm.invalid) {
      this.isInvalid = true;
      return;
    }
    this.accountLoginService.createUser(userData).subscribe(response => {
      // TODO: Check should be in accordance with rest call response
      if (response) {
        this.localizeRouter.navigateToRoute('/home');
      }
    });
  }
  errorMessage() {
    return this.isUsername ? ('account.username.already_exist.error') : ('account.email.already_exist.error');
  }
}

