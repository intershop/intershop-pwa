import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { matchOtherValidator, EmailValidator, PasswordValidator } from 'app/shared/validators';

@Component({
  selector: 'is-email',
  templateUrl: './emailPassword.component.html'
})

export class EmailPasswordComponent implements OnInit {
  private emailForm: FormGroup;
  @Output() isValid: EventEmitter<Boolean> = new EventEmitter();

  constructor(private _formbuilder: FormBuilder){  }
    ngOnInit() {
      this.emailForm = this._formbuilder.group({
      emailDetails: this._formbuilder.group({
        emailAddress: ['', [Validators.required,
          EmailValidator.validate
        ]],
        confirmEmailAddress: ['', [Validators.required,
          matchOtherValidator('emailAddress')
        ]],
        password: ['', [Validators.required,
          PasswordValidator.validate
        ]],
        confirmPassword: ['', [Validators.required,
          matchOtherValidator('password')]],
        securityQuestion: ['', [Validators.required]],
        answer: ['', [Validators.required]],
        receivePromotions: []
      })
    });

    this.emailForm.valueChanges.subscribe(() => {
      if ( this.emailForm.valid ) {
        this.isValid.emit(true);
      } else {
        this.isValid.emit(false);
      }
    });
  }  
}

