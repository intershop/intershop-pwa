import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './registrationPage.component.html'
})

export class RegistrationPageComponent implements OnInit {
    private isCaptchaValid = false;
    private isAddressFormValid : boolean = false;
    private isEmailFormValid : boolean = false;

    constructor(private router: Router) { }

    ngOnInit() {
       
    }

    save() {
        //console.log(this.createAccountForm.value);
    }

    cancelClicked() {
        this.router.navigate(['']);
    }

    fnSubmit() { }
};




