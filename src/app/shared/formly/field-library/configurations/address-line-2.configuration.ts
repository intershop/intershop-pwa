import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Address Line 2, not required by default
 */
@Injectable()
export class AddressLine2Configuration extends FieldLibraryConfiguration {
  id = 'addressLine2';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.street2.label',
        required: false,
      },
    };
  }
}
