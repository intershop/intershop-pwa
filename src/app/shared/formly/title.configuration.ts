import { Injectable } from '@angular/core';
import { FieldLibraryConfiguration } from '@intershop-pwa/formly/field-library/configurations/field-library-configuration';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FormsService } from 'ish-shared/forms/utils/forms.service';

/**
 * Title/Salutation, automatically extracts options from FormsService, not required by default
 */
@Injectable()
export class TitleConfiguration extends FieldLibraryConfiguration {
  constructor(private formsService: FormsService) {
    super();
  }
  id = 'title';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-select-field',
      templateOptions: {
        label: 'account.default_address.title.label',
        placeholder: 'account.option.select.text',
        options: this.formsService.getSalutationOptions(),
      },
    };
  }
}
