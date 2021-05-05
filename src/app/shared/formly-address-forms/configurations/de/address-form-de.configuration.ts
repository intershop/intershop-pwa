import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';
import { of } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import {
  AddressFormConfiguration,
  addressesFieldConfiguration,
} from 'ish-shared/formly-address-forms/configurations/address-form.configuration';
import { FormsService } from 'ish-shared/forms/utils/forms.service';

@Injectable()
export class AddressFormDEConfiguration extends AddressFormConfiguration {
  countryCode = 'DE';

  constructor(private formsService: FormsService) {
    super();
  }
  getModel(model: Partial<Address> = {}): Partial<Address> {
    return pick(
      model,
      'companyName1',
      'companyName2',
      'title',
      'firstName',
      'lastName',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'postalCode',
      'city',
      'phoneHome'
    );
  }

  getFieldConfiguration(): FormlyFieldConfig[] {
    return addressesFieldConfiguration([
      this.businessCustomer && !this.shortForm && ['companyName1', 'companyName2'],
      !this.shortForm && [
        {
          key: 'title',
          type: 'ish-select-field',
          templateOptions: {
            label: 'account.default_address.title.label',
            options: of(this.formsService.getSalutationOptionsForCountryCode(this.countryCode)),
            placeholder: 'account.option.select.text',
          },
        },
        'firstName',
        'lastName',
      ],
      [
        'addressLine1',
        'addressLine2',
        {
          key: 'addressLine3',
          type: 'ish-text-input-field',
          templateOptions: {
            label: 'account.default_address.street3.label',
            required: false,
          },
        },
      ],
      [
        {
          key: 'postalCode',
          type: 'ish-text-input-field',
          templateOptions: {
            label: 'account.default_address.postalcode.label',
            required: true,
            maxLength: 5,
          },
          validators: {
            validation: [Validators.pattern('[0-9]{5}')],
          },
          validation: {
            messages: {
              required: 'account.address.postalcode.missing.error',
              pattern: 'account.address.de.postalcode.error.regexp',
            },
          },
        },
        'city',
      ],
      !this.shortForm ? 'phoneHome' : undefined,
    ]);
  }
}
