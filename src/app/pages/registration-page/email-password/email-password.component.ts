import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

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
    const emailAddress = new FormControl(null, [Validators.compose([Validators.required, CustomValidators.email, Validators.maxLength(256)])]);
    const confirmEmailAddressControl = new FormControl('', [Validators.compose([Validators.required, CustomValidators.equalTo(emailAddress), Validators.maxLength(256)])]);
    const password = new FormControl(null, [Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$/),
    Validators.maxLength(256)])]);
    const confirmPasswordControl = new FormControl('', [Validators.compose([Validators.required, CustomValidators.equalTo(password)])]);
    this.emailForm = this._formbuilder.group({
      emailDetails: this._formbuilder.group({
        emailAddress: emailAddress,
        confirmEmailAddress: confirmEmailAddressControl,
        password: password,
        confirmPassword: confirmPasswordControl,
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
