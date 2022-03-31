import { FormlyFieldConfig } from '@ngx-formly/core';

import { Address } from 'ish-core/models/address/address.model';

/*
 * Abstract class that valid address configurations have to extend.
 * The countryCode, businessCustomer and shortForm properties will be set by the AddressFormConfigurationProvider
 */
export abstract class AddressFormConfiguration {
  countryCode = 'default';
  businessCustomer = false;
  shortForm = false;

  abstract getFieldConfiguration(countryCode?: string): FormlyFieldConfig[];

  abstract getModel(model?: Partial<Address>): Partial<Address>;
}
// helper method to reduce repetition when defining address form configurations containing standard fields
export function addressesFieldConfiguration(
  keys: (
    | keyof Address
    | (FormlyFieldConfig & { key: keyof Address })
    | (keyof Address | (FormlyFieldConfig & { key: keyof Address }))[]
  )[]
): FormlyFieldConfig[] {
  return keys
    .map(key =>
      Array.isArray(key)
        ? key?.length && {
            type: 'ish-fieldset-field',
            fieldGroup: addressesFieldConfiguration(key),
          }
        : typeof key === 'string'
        ? { type: `#${key}` }
        : key
    )
    .filter(x => !!x);
}
