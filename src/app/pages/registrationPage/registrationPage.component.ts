import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './registrationPage.component.html'
})

export class RegistrationPageComponent implements OnInit {
    isCaptchaValid = false;
    isAddressFormValid = false;
    isEmailFormValid = false;

    constructor(private router: Router) { }

    ngOnInit() { }
   

    /**
     * Redirects to Family page
     * @returns void
     */
    cancelClicked():void {
        this.router.navigate(['']);
    }
    
    /**
     * @returns void
     * Creates Account
     */
    createAccount(): void {
        
    }
}





