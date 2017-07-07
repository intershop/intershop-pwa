import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { CreateAccountModel } from "app/pages/registrationPage/registrationPage.model";
import { matchOtherValidator } from "app/shared/validators";

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
                Validators.pattern('([a-zA-Z0-9_.]{1,})((@[a-zA-Z]{2,})[\\\.]([a-zA-Z]{2}|[a-zA-Z]{3}))')
                ]],
                confirmEmailAddress: ['', [Validators.required,
                matchOtherValidator('emailAddress')
                ]],
                password: ['', [Validators.required,
                Validators.pattern('(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$')
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

    save() {
        console.log(this.createAccountForm.value);
    }

    cancelClicked() {
        this.router.navigate(['']);
    }

    resolved(captchaResponse: string) {
        this.invalidCaptcha = false;
        console.log(`Resolved captcha with response ${captchaResponse}:`);
    }
    fnSubmit() {
    
    }

};




