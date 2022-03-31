import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Last name, special characters forbidden and required by default
 */
@Injectable()
export class LastNameConfiguration extends FieldLibraryConfiguration {
  id = 'lastName';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.lastname.label',
        required: true,
      },
      validators: {
        validation: [SpecialValidators.noSpecialChars],
      },
      validation: {
        messages: {
          required: 'account.address.lastname.error.required',
          noSpecialChars: 'account.name.error.forbidden.chars',
        },
      },
    };
  }
}
