import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Address Line 1 (usually street & number), required by default
 */
@Injectable()
export class AddressLine1Configuration extends FieldLibraryConfiguration {
  id = 'addressLine1';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.street.label',
        required: true,
      },
      validation: {
        messages: {
          required: 'account.address.address1.error.required',
        },
      },
    };
  }
}
