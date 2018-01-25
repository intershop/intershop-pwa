import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { CustomerRegistrationService } from '../../services/customer-registration.service';

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
    private fb: FormBuilder,
    private customerService: CustomerRegistrationService
  ) { }

  ngOnInit() {
    this.isDirty = false;
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.fb.group({
      preferredLanguage: ['en_US', [Validators.required]],
      birthday: ['']
    });
  }

  /**
   * Redirects to home page
   * @returns void
   */
  cancelClicked(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Creates Account
   * @method onCreateAccount
   * @returns void
   */
  onCreateAccount(): void {
    // console.log(JSON.stringify(this.registrationForm.value));

    if (this.registrationForm.valid) {
      const customer = CustomerFactory.fromForm(this.registrationForm);
      // console.log(JSON.stringify(customer));
      if (customer.birthday === '') { customer.birthday = null; }   // ToDo see IS-22276
      this.customerService.registerPrivateCustomer(customer).subscribe(response => {

        if (response) {
          this.router.navigate(['/home']);
        }
      });

    } else {
      this.isDirty = true;
    }
  }

}
