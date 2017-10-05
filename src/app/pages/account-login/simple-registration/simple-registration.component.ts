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
  userRegistrationLoginType: string;
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
    private localize: LocalizeRouterService,
    private globalConfiguration: GlobalConfiguration,
    private accountLoginService: AccountLoginService) {
  }

  /**
     * Creates Login Form
     */
  ngOnInit() {
    this.globalConfiguration.getApplicationSettings().subscribe(data => {
      this.userRegistrationLoginType = data ? data.userRegistrationLoginType : 'email';
      const userName = new FormControl('', [this.userRegistrationLoginType === 'username' ? Validators.required : Validators.nullValidator]);
      const email = new FormControl('', [Validators.required, CustomValidators.email]);
      const password = new FormControl('', [Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$/)])]);
      const confirmPassword = new FormControl('', [Validators.compose([Validators.required, CustomValidators.equalTo(password)])]);
      this.simpleRegistrationForm = this.formBuilder.group({
        userName: userName,
        email: email,
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
    if (this.simpleRegistrationForm.valid) {
      this.accountLoginService.createUser(userData).subscribe(response => {
        if (response) {
          this.localize.navigateToRoute('/home');
        }
      });
    } else {
      this.isInvalid = true;
    }
  }
}

