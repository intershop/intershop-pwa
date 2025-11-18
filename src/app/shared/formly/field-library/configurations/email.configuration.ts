import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Email address, not required by default
 */
@Injectable()
export class EmailConfiguration extends FieldLibraryConfiguration {
  id = 'email';
  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      props: {
        label: 'account.address.email.label',
        required: false,
      },
      validators: {
        validation: [SpecialValidators.email],
      },
      validation: {
        messages: {
          email: 'account.address.email.error.regexp',
        },
      },
    };
  }
}
