import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { pick } from 'lodash-es';
import { of } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import {
  AddressFormConfiguration,
  addressesFieldConfiguration,
} from 'ish-shared/formly-address-forms/configurations/address-form.configuration';
import { determineSalutations } from 'ish-shared/forms/utils/form-utils';

@Injectable()
export class AddressFormFRConfiguration extends AddressFormConfiguration {
  countryCode = 'FR';

  constructor(private translate: TranslateService) {
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
              determineSalutations(this.countryCode)
                .map(salutation => this.translate.instant(salutation))

                .map(salutation => ({ value: salutation, label: salutation }))
            ),
            placeholder: 'account.option.select.text',
          },
        },
        'firstName',
        'lastName',
      ],
      ['addressLine1', 'addressLine2'],
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
