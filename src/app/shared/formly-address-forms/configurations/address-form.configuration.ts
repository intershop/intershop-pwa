import { FormlyFieldConfig } from '@ngx-formly/core';

import { Address } from 'ish-core/models/address/address.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

export abstract class AddressFormConfiguration {
  countryCode = 'default';
  businessCustomer = false;
  shortForm = false;

  abstract getFieldConfiguration(countryCode?: string): FormlyFieldConfig[];

  abstract getModel(model?: Partial<Address>): Partial<Address>;
}

function applyStandardStyles(config: FormlyFieldConfig): FormlyFieldConfig {
  /* do some customization here */
  return config;
}

const standardFields: { [key: string]: Omit<FormlyFieldConfig, 'key'> } = {
  companyName1: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.address.company_name.label',
      required: true,
    },
    validation: {
      messages: {
        required: 'account.address.company_name.error.required',
      },
    },
  },
  companyName2: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.address.company_name_2.label',
      required: false,
    },
  },
  firstName: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.default_address.firstname.label',
      required: true,
    },
    validators: {
      validation: [SpecialValidators.noSpecialChars],
    },
    validation: {
      messages: {
        required: 'account.address.firstname.missing.error',
        noSpecialChars: 'account.name.error.forbidden.chars',
      },
    },
  },
  lastName: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.default_address.lastname.label',
      required: true,
    },
    validators: {
      validation: [SpecialValidators.noSpecialChars],
    },
    validation: {
      messages: {
        required: 'account.address.lastname.missing.error',
        noSpecialChars: 'account.name.error.forbidden.chars',
      },
    },
  },
  addressLine1: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.default_address.street.label',
      required: true,
    },
    validation: {
      messages: {
        required: 'account.address.address1.missing.error',
      },
    },
  },
  addressLine2: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.default_address.street2.label',
      required: false,
    },
  },
  postalCode: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.default_address.postalcode.label',
      required: true,
    },
    validation: {
      messages: {
        required: 'account.address.postalcode.missing.error',
      },
    },
  },
  city: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.default_address.city.label',
      required: true,
    },
    validation: {
      messages: {
        required: 'account.address.city.missing.error',
      },
    },
  },
  phoneHome: {
    type: 'ish-text-input-field',
    templateOptions: {
      label: 'account.profile.phone.label',
      required: false,
    },
  },
  fax: {},
};

function standardField(key: keyof Address | (FormlyFieldConfig & { key: keyof Address })): FormlyFieldConfig {
  if (typeof key === 'string') {
    if (!standardFields[key]) {
      throw new TypeError(`Cannot find "${key}" in standard fields.`);
    }
    return applyStandardStyles({ key, ...standardFields[key] });
  }
  return applyStandardStyles(key);
}

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
        : standardField(key)
    )
    .filter(x => !!x);
}
