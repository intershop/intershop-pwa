import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Company name 2, not required by default
 */
@Injectable()
export class CompanyName2Configuration extends FieldLibraryConfiguration {
  id = 'companyName2';

  getFieldConfig(): FormlyFieldConfig {
    return {
      key: 'companyName2',
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.company_name_2.label',
        required: false,
      },
    };
  }
}
