import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './registrationPage.component.html'
})

export class RegistrationPageComponent implements OnInit {
    isCaptchaValid = false;
    isAddressFormValid = false;
    isEmailFormValid = false;

    /**
     * constructor
     * @param  {Router} privaterouter
     */
    constructor(private router: Router) { };

    ngOnInit() { };

    /**
     * Redirects to Family page
     * @returns void
     */
    cancelClicked(): void {
        this.router.navigate(['']);
    };

    /**
     * Creates Account
     * @returns void
     */
    createAccount(): void { };

    /**
     * Submit form values
     * @returns void
     */
    fnSubmit(): void { };
};





