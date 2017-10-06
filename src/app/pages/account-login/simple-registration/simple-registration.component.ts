import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
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
   * @param {FormBuilder} formBuilder
   * @param {LocalizeRouterService} localize
   * @param {GlobalConfiguration} globalConfiguration
   * @param {SimpleRegistrationService} simpleRegistrationService
   */
  constructor(private formBuilder: FormBuilder,
    private localize: LocalizeRouterService,
    private globalConfiguration: GlobalConfiguration,
    private simpleRegistrationService: SimpleRegistrationService) {
  }

  /**
     * Creates Login Form
     */
  ngOnInit() {
    this.globalConfiguration.getApplicationSettings().subscribe(data => {
      this.userRegistrationLoginType = data ? data.userRegistrationLoginType : 'email';
      const password = new FormControl('', [Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$/)])]);
      const confirmPassword = new FormControl('', [Validators.compose([Validators.required, CustomValidators.equalTo(password)])]);
      this.simpleRegistrationForm = this.formBuilder.group({
        userName: ['', [Validators.compose([Validators.required,
        (this.userRegistrationLoginType === 'email' ? CustomValidators.email : null)])]],
        password: password,
        confirmPassword: confirmPassword
      });
    });
  }


  createAccount(userData) {
    if (this.simpleRegistrationForm.valid) {
      this.simpleRegistrationService.createUser(userData as UserDetail).subscribe(response => {
        if (response) {
          this.localize.navigateToRoute('/home');
        }
      });
    }
  }
}

