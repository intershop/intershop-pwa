import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Phone, not required by default
 */
@Injectable()
export class PhoneHomeConfiguration extends FieldLibraryConfiguration {
  id = 'phoneHome';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-phone-field',
      templateOptions: {
        label: 'account.profile.phone.label',
        required: false,
      },
    };
  }
}
