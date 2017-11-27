import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  templateUrl: './registration-page.component.html'
})

export class RegistrationPageComponent implements OnInit {
  isCaptchaValid = false;
  isAddressFormValid = false;
  isEmailFormValid = false;

  registrationForm: FormGroup;
  isDirty: Boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.isDirty = false;
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.fb.group({
      preferredLanguage: ['en_US', [Validators.required]],
    });
  }

  /**
   * Redirects to Family page
   * @returns void
   */
  cancelClicked(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Submit form values
   * @returns void
   */
  fnSubmit(): void {
  }
}





