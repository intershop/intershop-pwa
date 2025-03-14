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
      props: {
        label: 'account.address.city.label',
        required: true,
        attributes: { autocomplete: 'address-level2' },
      },
      validation: {
        messages: {
          required: 'account.address.city.error.required',
        },
      },
    };
  }
}
