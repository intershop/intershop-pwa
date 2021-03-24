import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Address } from 'ish-core/models/address/address.model';
import {
  AddressFormConfiguration,
  addressesFieldConfiguration,
} from 'ish-shared/formly-address-forms/configurations/address-form.configuration';

@Injectable()
export class AddressFormDefaultConfiguration extends AddressFormConfiguration {
  countryCode = '';

  constructor(private appFacade: AppFacade) {
    super();
  }

  getModel(model: Partial<Address> = {}): Partial<Address> {
    return pick(
      model,
      'companyName1',
      'companyName2',
      'firstName',
      'lastName',
      'addressLine1',
      'addressLine2',
      'postalCode',
      'city',
      'mainDivisionCode',
      'phoneHome'
    );
  }

  getFieldConfiguration(countryCode?: string): FormlyFieldConfig[] {
    return addressesFieldConfiguration([
      this.businessCustomer && !this.shortForm && ['companyName1', 'companyName2'],
      !this.shortForm && ['firstName', 'lastName'],
      ['addressLine1', 'addressLine2'],
      [
        'postalCode',
        'city',
        {
          key: 'mainDivisionCode',
          type: 'ish-select-field',
          templateOptions: {
            required: true,
            label: 'account.default_address.state.label',
            placeholder: 'account.option.select.text',
            options:
              !!countryCode && countryCode !== 'default'
                ? this.appFacade
                    .regions$(countryCode)
                    .pipe(map(regions => regions?.map(region => ({ value: region.regionCode, label: region.name }))))
                : of([]),
          },
          validation: {
            messages: {
              required: 'account.address.state.error.default',
            },
          },
        },
      ],
      !this.shortForm ? 'phoneHome' : undefined,
    ]);
  }
}
