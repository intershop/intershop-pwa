import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FormsService } from 'ish-shared/forms/utils/forms.service';

import { FieldLibraryConfiguration } from './field-library-configuration';

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
        label: 'account.address.title.label',
        placeholder: 'account.option.select.text',
        options: this.formsService.getSalutationOptions(),
      },
    };
  }
}
