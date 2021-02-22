import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'ish-password-field',
  templateUrl: './password-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFieldComponent extends FieldType {
  formControl: FormControl;

  prePopulate(field: FormlyFieldConfig) {
    field.validators = field.validators ?? {};
    field.validators.validation = [...(field.validators.validation ?? []), SpecialValidators.password];

    field.validation = field.validation ?? {};
    field.validation.messages = {
      ...field.validation.messages,
      password: 'account.update_password.new_password.error.regexp',
    };
  }
}
