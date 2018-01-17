import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { CustomerRegistrationService } from '../../services/customer-registration.service';
import { FormUtilsService } from '../../../core/services/utils/form-utils.service';

@Component({
  templateUrl: './registration-page.component.html'
})

export class RegistrationPageComponent implements OnInit {
  isCaptchaValid = false;
  isAddressFormValid = false;
  isEmailFormValid = false;
  isDirty = false;

  registrationForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private customerService: CustomerRegistrationService,
    private formUtils: FormUtilsService
  ) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      preferredLanguage: ['en_US', [Validators.required]],
      birthday: ['']
    });
  }

  /**
   * Cancels form and redirects to home page
   * @method cancelForm
   * @returns void
   */
  cancelForm() {
    this.router.navigate(['/home']);
  }

  /**
   * Submits form and creates account when valid
   * @method submitForm
   * @returns void
   */

  submitForm() {
    if (this.registrationForm.invalid) {
      this.isDirty = true;
      this.formUtils.markAsDirtyRecursive(this.registrationForm);
      return;
    }

    const customerData = CustomerFactory.fromFormToData(this.registrationForm);
    // console.log(JSON.stringify(customer));
    if (customerData.birthday === '') { customerData.birthday = null; }   // ToDo see IS-22276
    this.customerService.registerPrivateCustomer(customerData).subscribe(response => {

      if (response) {
        this.router.navigate(['/home']);
      }
    });
  }

}
