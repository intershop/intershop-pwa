import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Organization Settings Company Page Component displays a form for changing a business customers' company data
 * see also: {@link OrganizationSettingsCompanyPageComponent}
 */
@Component({
  selector: 'ish-organization-settings-company',
  templateUrl: './organization-settings-company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationSettingsCompanyComponent implements OnInit {
  @Input({ required: true }) currentCustomer: Customer;
  @Input() error: HttpError;
  @Output() updateCompanyProfile = new EventEmitter<Customer>();

  private submitted = false;

  organizationSettingsCompanyForm = new FormGroup({});
  model: Partial<Customer>;
  fields: FormlyFieldConfig[];

  constructor(private fieldLibrary: FieldLibrary) {}

  ngOnInit() {
    this.model = pick(this.currentCustomer, 'companyName', 'companyName2', 'taxationID');
    this.fields = this.fieldLibrary.getConfigurationGroup('companyInfo', { companyName1: { key: 'companyName' } });
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submit() {
    if (this.organizationSettingsCompanyForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.organizationSettingsCompanyForm);
      return;
    }
    const companyName = this.organizationSettingsCompanyForm.get('companyName').value;
    const companyName2 = this.organizationSettingsCompanyForm.get('companyName2').value;
    const taxationID = this.organizationSettingsCompanyForm.get('taxationID').value;

    this.updateCompanyProfile.emit({ ...this.currentCustomer, companyName, companyName2, taxationID });
  }

  get buttonDisabled() {
    return this.organizationSettingsCompanyForm.invalid && this.submitted;
  }
}
