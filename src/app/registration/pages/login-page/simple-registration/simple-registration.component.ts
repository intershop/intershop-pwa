// NEEDS_WORK: actual functionality is missing REST call, error handling, validators
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { CustomValidators } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { USER_REGISTRATION_LOGIN_TYPE } from '../../../../core/configurations/injection-keys';
import { FormUtilsService } from '../../../../core/services/utils/form-utils.service';
import { CoreState, CreateUser, getLoginError } from '../../../../core/store/user';
import { CustomerFactory } from '../../../../models/customer/customer.factory';
import { CustomerData } from '../../../../models/customer/customer.interface';


@Component({
  selector: 'ish-simple-registration',
  templateUrl: './simple-registration.component.html'
})

export class SimpleRegistrationComponent implements OnInit {
  simpleRegistrationForm: FormGroup;
  isUsername: boolean;
  userCreateError$: Observable<HttpErrorResponse>;
  isDirty: boolean;

  constructor(
    @Inject(USER_REGISTRATION_LOGIN_TYPE) private userRegistrationLoginType: string,
    private store: Store<CoreState>,
    private formBuilder: FormBuilder,
    private formUtils: FormUtilsService
  ) { }

  /**
     * Creates Login Form
  */
  ngOnInit() {
    this.userCreateError$ = this.store.pipe(select(getLoginError));

    this.isUsername = this.userRegistrationLoginType === 'username';
    const password = new FormControl('', [Validators.required, Validators.minLength(7), Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$/)]);
    const confirmPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);
    this.simpleRegistrationForm = this.formBuilder.group({
      userName: ['', Validators.compose([this.isUsername ? Validators.required : Validators.nullValidator])],
      email: ['', [Validators.required, CustomValidators.email]],
      password: password,
      confirmPassword: confirmPassword
    });
  }

  /**
     * Creates simple Account
  */
  createAccount() {
    if (this.simpleRegistrationForm.invalid) {
      this.isDirty = true;
      this.formUtils.markAsDirtyRecursive(this.simpleRegistrationForm);
      return;
    }
    const userData: CustomerData = CustomerFactory.fromFormValueToData(this.simpleRegistrationForm.value);

    this.store.dispatch(new CreateUser(userData));
  }

  errorMessage() {
    return this.isUsername ? ('account.username.already_exist.error') : ('account.email.already_exist.error');
  }
}

