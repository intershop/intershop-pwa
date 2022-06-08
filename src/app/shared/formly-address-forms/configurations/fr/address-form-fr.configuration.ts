import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { Address } from 'ish-core/models/address/address.model';
import {
  AddressFormConfiguration,
  addressesFieldConfiguration,
} from 'ish-shared/formly-address-forms/configurations/address-form.configuration';

@Injectable()
export class AddressFormFRConfiguration extends AddressFormConfiguration {
  countryCode = 'FR';

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
      'postalCode',
      'city',
      'phoneHome'
    );
  }

  getFieldConfiguration(): FormlyFieldConfig[] {
    return addressesFieldConfiguration([
      this.businessCustomer && !this.shortForm && ['companyName1', 'companyName2'],
      !this.shortForm && ['title', 'firstName', 'lastName'],
      ['addressLine1', 'addressLine2'],
      [
        {
          key: 'postalCode',
          type: '#postalCode',
          templateOptions: {
            maxLength: 5,
          },
          validators: {
            validation: [Validators.pattern('[0-9]{5}')],
          },
          validation: {
            messages: {
              pattern: 'account.address.fr.postalcode.error.regexp',
            },
          },
        },
        'city',
      ],
      !this.shortForm ? 'phoneHome' : undefined,
    ]);
  }
}
