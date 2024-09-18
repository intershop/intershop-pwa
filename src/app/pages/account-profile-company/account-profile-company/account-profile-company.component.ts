import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Account Profile Company Page Component displays a form for changing a business customers' company data
 * see also: {@link AccountProfileCompanyPageComponent}
 */
@Component({
  selector: 'ish-account-profile-company',
  templateUrl: './account-profile-company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileCompanyComponent implements OnInit {
  @Input({ required: true }) currentCustomer: Customer;
  @Input() error: HttpError;
  @Output() updateCompanyProfile = new EventEmitter<Customer>();

  private submitted = false;

  accountProfileCompanyForm = new FormGroup({});
  model: Partial<Customer>;
  fields: FormlyFieldConfig[];

  private budgetPriceType: FormlyFieldConfig = {
    type: 'ish-fieldset-field',
    fieldGroup: [
      {
        type: 'ish-radio-field',
        key: 'budgetPriceType',
        props: {
          title: 'account.costcenter.price.type.title',
          value: 'gross',
          label: 'account.costcenter.gross.label',
        },
      },
      {
        type: 'ish-radio-field',
        key: 'budgetPriceType',
        props: {
          label: 'account.costcenter.net.label',
          value: 'net',
        },
      },
    ],
  };

  constructor(private fieldLibrary: FieldLibrary) {}

  ngOnInit() {
    this.fields = this.fieldLibrary
      .getConfigurationGroup('companyInfo', { companyName1: { key: 'companyName' } })
      .concat(this.budgetPriceType);
    this.model = pick(this.currentCustomer, 'companyName', 'companyName2', 'taxationID', 'budgetPriceType');
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
    const budgetPriceType = this.accountProfileCompanyForm.get('budgetPriceType').value;

    this.updateCompanyProfile.emit({ ...this.currentCustomer, companyName, companyName2, taxationID, budgetPriceType });
  }

  get buttonDisabled() {
    return this.accountProfileCompanyForm.invalid && this.submitted;
  }
}
