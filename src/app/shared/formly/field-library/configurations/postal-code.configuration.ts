import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Postal code, required by default
 */
@Injectable()
export class PostalCodeConfiguration extends FieldLibraryConfiguration {
  id = 'postalCode';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.postalcode.label',
        required: true,
      },
      validation: {
        messages: {
          required: 'account.address.postalcode.error.required',
        },
      },
    };
  }
}
