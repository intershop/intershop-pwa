import { Component } from '@angular/core';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  templateUrl: './registration-page.component.html'
})

export class RegistrationPageComponent {
  isCaptchaValid = false;
  isAddressFormValid = false;
  isEmailFormValid = false;

  /**
   * Constructor
   * @param {LocalizeRouterService} localize
   */
  constructor(private localize: LocalizeRouterService) {
  }

  /**
   * Redirects to Family page
   * @returns void
   */
  cancelClicked(): void {
    this.localize.navigateToRoute('');
  }

  /**
   * Submit form values
   * @returns void
   */
  fnSubmit(): void {
  }
}





