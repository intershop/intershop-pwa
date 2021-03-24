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
import { determineSalutations } from 'ish-shared/forms/utils/form-utils';

@Injectable()
export class AddressFormGBConfiguration extends AddressFormConfiguration {
  countryCode = 'GB';

  constructor() {
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
            options: of(
              determineSalutations(this.countryCode).map(salutation => ({ value: salutation, label: salutation }))
            ),
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
          templateOptions: {
            label: 'account.default_address.uk.locality.label',
            required: false,
          },
          type: 'ish-text-input-field',
        },
      ],
      [
        'city',
        {
          key: 'postalCode',
          templateOptions: {
            label: 'account.default_address.postalcode.label',
            required: true,
          },
          validators: {
            validation: [
              Validators.pattern(
                '^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$'
              ),
            ],
          },
          validation: {
            messages: {
              required: 'account.address.postalcode.missing.error',
              pattern: 'account.address.uk.postalcode.error.regexp',
            },
          },
          type: 'ish-text-input-field',
        },
      ],
      !this.shortForm ? 'phoneHome' : undefined,
    ]);
  }
}
