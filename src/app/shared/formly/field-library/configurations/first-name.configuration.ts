import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * First name, special characters forbidden and required by default
 */
@Injectable()
export class FirstNameConfiguration extends FieldLibraryConfiguration {
  id = 'firstName';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.firstname.label',
        required: true,
      },
      validators: {
        validation: [SpecialValidators.noSpecialChars],
      },
      validation: {
        messages: {
          required: 'account.address.firstname.error.required',
          noSpecialChars: 'account.name.error.forbidden.chars',
        },
      },
    };
  }
}
