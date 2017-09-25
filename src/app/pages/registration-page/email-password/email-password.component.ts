import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidations } from '../../../validators/custom.validations';

@Component({
  selector: 'is-email-password',
  templateUrl: './email-password.component.html'
})

export class EmailPasswordComponent implements OnInit {
  emailForm: FormGroup;
  @Output() isValid: EventEmitter<Boolean> = new EventEmitter();

  /**
   * Constructor
   * @param  {FormBuilder} private_formbuilder
   */
  constructor(private _formbuilder: FormBuilder) { }

  ngOnInit() {
    this.emailForm = this._formbuilder.group({
      emailDetails: this._formbuilder.group({
        emailAddress: [null, [Validators.required, CustomValidations.emailValidate, Validators.maxLength(256)]],
        confirmEmailAddress: [null, [Validators.required,
        //CustomValidations.mismatchedValidation('emailAddress', 'confirmEmailAddress'), 
        Validators.maxLength(256)]],
        password: [null, [Validators.required, CustomValidations.passwordValidate, Validators.minLength(7)]],
        confirmPassword: [null, [Validators.required,
          //CustomValidations.mismatchedValidation('password', 'confirmPassword')
        ]],
        securityQuestion: ['', [Validators.required]],
        answer: ['', [Validators.required]],
        receivePromotions: []
      })
    });

    this.emailForm.valueChanges.subscribe(() => {
      this.emailForm.valid ? this.isValid.emit(true) : this.isValid.emit(false);
    });
  }
}
