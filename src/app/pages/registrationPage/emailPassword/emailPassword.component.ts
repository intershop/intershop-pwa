import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {EmailValidator} from '../../../shared/validators/email.validator';
import {matchOtherValidator} from '../../../shared/validators/matchWords.validator';
import {PasswordValidator} from '../../../shared/validators/password.validator';

@Component({
  selector: 'is-email',
  templateUrl: './emailPassword.component.html'
})

export class EmailPasswordComponent implements OnInit {
  emailForm: FormGroup;
  @Output() isValid: EventEmitter<Boolean> = new EventEmitter();

  constructor(private _formbuilder: FormBuilder) {
  }

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
