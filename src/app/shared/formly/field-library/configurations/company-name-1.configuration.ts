import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Company Name 1, required by default
 */
@Injectable()
export class CompanyName1Configuration extends FieldLibraryConfiguration {
  id = 'companyName1';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.company_name.label',
        required: true,
      },
      validation: {
        messages: {
          required: 'account.address.company_name.error.required',
        },
      },
    };
  }
}
