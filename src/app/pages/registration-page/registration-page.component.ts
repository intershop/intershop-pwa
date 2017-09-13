import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

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
    constructor(private router: Router,
                private localize: LocalizeRouterService) { }

    /**
     * Redirects to Family page
     * @returns void
     */
    cancelClicked(): void {
        this.router.navigate([this.localize.translateRoute('')]);
    }

    /**
     * Submit form values
     * @returns void
     */
    fnSubmit(): void {
    }
}





