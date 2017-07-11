import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { CreateAccountModel } from 'app/pages/registrationPage/registrationPage.model';
import { matchOtherValidator, EmailValidator, PasswordValidator } from 'app/shared/validators';

@Component({
    templateUrl: './registrationPage.component.html'
})

export class RegistrationPageComponent implements OnInit {
    public email: any;
    public invalidCaptcha = true;

    userDetails: CreateAccountModel;
    createAccountForm: FormGroup;

    constructor(private _formbuilder: FormBuilder,
        private router: Router
    ) { }

    ngOnInit() {
        this.createAccountForm = this._formbuilder.group({
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
            }),
            address: this._formbuilder.group({
                country: ['', [Validators.required]],
                firstName: ['', [Validators.required]],
                lastName: ['', [Validators.required]],
                line1: ['', [Validators.required]],
                line2: [],
                zip: ['', [Validators.required]],
                city: ['', [Validators.required]],
                phone: [],
                preferredLanguage: ['', [Validators.required]],
                birthday: [],
               // state: ['', [Validators.required]],
            }),

        })
    }

    onValidCaptcha( captchaValidation ){
      this.invalidCaptcha = captchaValidation;
    }

    save() {
        console.log(this.createAccountForm.value);
    }

    cancelClicked() {
        this.router.navigate(['']);
    }

    fnSubmit() { }
};




