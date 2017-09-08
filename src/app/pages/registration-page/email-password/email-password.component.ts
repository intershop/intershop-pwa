import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmailValidator } from '../../../validators/email.validator';
import { matchOtherValidator } from '../../../validators/match-words.validator';
import { PasswordValidator } from '../../../validators/password.validator';

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
        emailAddress: ['', [Validators.required,
        EmailValidator.validate, Validators.maxLength(256)
        ]],
        confirmEmailAddress: ['', [Validators.required,
        matchOtherValidator('emailAddress'), Validators.maxLength(256)
        ]],
        password: ['', [Validators.required,
        PasswordValidator.validate, Validators.minLength(7)
        ]],
        confirmPassword: ['', [Validators.required,
        matchOtherValidator('password')]],
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
