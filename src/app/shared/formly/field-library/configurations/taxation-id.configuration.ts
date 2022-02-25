import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Taxation ID, not required by default
 */
@Injectable()
export class TaxationIDConfiguration extends FieldLibraryConfiguration {
  id = 'taxationID';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.taxation.label',
      },
    };
  }
}
