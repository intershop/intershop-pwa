import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Account Profile Company Page Component displays a form for changing a business customers' company data
 * see also: {@link AccountProfileCompanyPageContainerComponent}
 */
@Component({
  selector: 'ish-account-profile-company',
  templateUrl: './account-profile-company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileCompanyComponent implements OnInit, OnChanges {
  @Input() currentCustomer: Customer;
  @Input() error: HttpError;

  @Output() updateCompanyProfile = new EventEmitter<Customer>();

  form: FormGroup;
  submitted = false;

  ngOnInit() {
    // create form
    this.form = new FormGroup({
      companyName: new FormControl('', Validators.required),
      companyName2: new FormControl(''),
      taxationID: new FormControl(''),
    });

    // initialize form values in case currentUser is available
    this.initFormValues();
  }

  ngOnChanges(c: SimpleChanges) {
    // initialize form values in case currentCustomer changes (current customer is later than form creation)
    if (c.currentCustomer) {
      this.initFormValues();
    }
  }

  /**
   * fills form values with data of the logged in customer
   */
  initFormValues() {
    if (this.form && this.currentCustomer) {
      this.form.get('companyName').setValue(this.currentCustomer.companyName);
      if (this.currentCustomer.companyName2) {
        this.form
          .get('companyName2')
          .setValue(this.currentCustomer.companyName2 ? this.currentCustomer.companyName2 : '');
      }
      if (this.currentCustomer.taxationID) {
        this.form.get('taxationID').setValue(this.currentCustomer.taxationID ? this.currentCustomer.taxationID : '');
      }
    }
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submit() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }
    const companyName = this.form.get('companyName').value;
    const companyName2 = this.form.get('companyName2').value;
    const taxationID = this.form.get('taxationID').value;

    this.updateCompanyProfile.emit({ ...this.currentCustomer, companyName, companyName2, taxationID });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
