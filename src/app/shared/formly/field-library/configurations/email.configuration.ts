import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Invoice/Shipping e-mail address with description and placeholder, not required by default
 */
@Injectable()
export class EmailConfiguration extends FieldLibraryConfiguration {
  id = 'email';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-email-field',
      props: {
        label: 'account.profile.email.label',
        placeholder: 'account.address.email.placeholder',
        postWrappers: [{ wrapper: 'description', index: -1 }],
        customDescription: 'account.address.email.description',
      },
    };
  }
}
