import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * Invoice/Shipping e-mail address The e-mail validator and error messages are added automatically by the field type.
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
