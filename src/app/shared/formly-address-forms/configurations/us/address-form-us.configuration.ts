import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Address } from 'ish-core/models/address/address.model';
import {
  AddressFormConfiguration,
  addressesFieldConfiguration,
} from 'ish-shared/formly-address-forms/configurations/address-form.configuration';

@Injectable()
export class AddressFormUSConfiguration extends AddressFormConfiguration {
  countryCode = 'US';

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
      'mainDivisionCode',
      'postalCode',
      'city',
      'phoneHome'
    );
  }

  getFieldConfiguration(): FormlyFieldConfig[] {
    return addressesFieldConfiguration([
      this.businessCustomer && !this.shortForm && ['companyName1', 'companyName2'],
      !this.shortForm && ['firstName', 'lastName'],
      ['addressLine1', 'addressLine2'],
      [
        {
          key: 'city',
          type: 'ish-text-input-field',
          templateOptions: {
            postWrappers: ['tooltip'],
            label: 'account.default_address.city.label',
            required: true,
            tooltip: {
              link: 'account.address.apo_fpo.link',
              text: 'account.address.apo_fpo.tooltip',
              title: 'account.address.apo_fpo.tooltip.headline',
            },
          },
          validation: {
            messages: {
              required: 'account.address.city.missing.error',
            },
          },
        },
        {
          key: 'mainDivisionCode',
          type: 'ish-select-field',
          templateOptions: {
            label: 'account.address.state.label',
            required: true,
            placeholder: 'account.option.select.text',
            options: this.appFacade
              .regions$(this.countryCode)
              .pipe(map(regions => regions?.map(region => ({ value: region.id, label: region.name })))),
          },
          validation: {
            messages: {
              required: 'account.address.state.error.default',
            },
          },
        },
        {
          key: 'postalCode',
          templateOptions: {
            label: 'account.default_address.postalcode.label',
            required: true,
          },
          validators: {
            validation: [Validators.pattern('^[0-9]{5}$|^[0-9]{5}-[0-9]{4}$')],
          },
          validation: {
            messages: {
              required: 'account.address.postalcode.missing.error',
              pattern: 'account.address.us.postalcode.error.regexp',
            },
          },
          type: 'ish-text-input-field',
        },
      ],
      !this.shortForm ? 'phoneHome' : undefined,
    ]);
  }
}
