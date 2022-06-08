import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * City, required by default
 */
@Injectable()
export class CityConfiguration extends FieldLibraryConfiguration {
  id = 'city';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.city.label',
        required: true,
      },
      validation: {
        messages: {
          required: 'account.address.city.error.required',
        },
      },
    };
  }
}
