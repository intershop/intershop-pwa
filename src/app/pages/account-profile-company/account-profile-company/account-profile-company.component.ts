import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

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
export class AccountProfileCompanyComponent implements OnInit {
  @Input() error: HttpError;
  @Input() currentCustomer: Customer;
  @Output() updateCompanyProfile = new EventEmitter<Customer>();

  submitted = false;

  accountProfileCompanyForm = new FormGroup({});
  model: Partial<Customer>;
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.model = pick(this.currentCustomer, 'companyName', 'companyName2', 'taxationID');
    this.fields = [
      {
        key: 'companyName',
        type: 'ish-text-input-field',
        templateOptions: {
          required: true,
          label: 'account.address.company_name.label',
        },
        validation: {
          messages: { required: 'account.address.company_name.error.required' },
        },
      },
      {
        key: 'companyName2',
        type: 'ish-text-input-field',
        templateOptions: {
          required: false,
          label: 'account.address.company_name_2.label',
        },
      },
      {
        key: 'taxationID',
        type: 'ish-text-input-field',
        templateOptions: {
          required: false,
          label: 'account.companyprofile.taxationid.label',
        },
      },
    ];
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submit() {
    if (this.accountProfileCompanyForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.accountProfileCompanyForm);
      return;
    }
    const companyName = this.accountProfileCompanyForm.get('companyName').value;
    const companyName2 = this.accountProfileCompanyForm.get('companyName2').value;
    const taxationID = this.accountProfileCompanyForm.get('taxationID').value;

    this.updateCompanyProfile.emit({ ...this.currentCustomer, companyName, companyName2, taxationID });
  }

  get buttonDisabled() {
    return this.accountProfileCompanyForm.invalid && this.submitted;
  }
}
