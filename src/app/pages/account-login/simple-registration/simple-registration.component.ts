import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../validators/email.validator';
import { matchOtherValidator } from '../../../validators/match-words.validator';
import { PasswordValidator } from '../../../validators/password.validator';
import { GlobalConfiguration } from '../../../global-configuration/global-configuration';
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
    private router: Router, private globalConfiguration: GlobalConfiguration,
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
      this.simpleRegistrationService.createUser(userData).subscribe(response => {
        if (response) {
          this.router.navigate(['home']);
        }
      });
    }
  }
}

