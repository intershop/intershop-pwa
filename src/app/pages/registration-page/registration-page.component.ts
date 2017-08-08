import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './registration-page.component.html'
})

export class RegistrationPageComponent {
    isCaptchaValid = false;
    isAddressFormValid = false;
    isEmailFormValid = false;

    /**
     * constructor
     * @param  {Router} privaterouter
     */
    constructor(private router: Router) { }

    /**
     * Redirects to Family page
     * @returns void
     */
    cancelClicked(): void {
        this.router.navigate(['']);
    }

    /**
     * Submit form values
     * @returns void
     */
    fnSubmit(): void {
    }
}





