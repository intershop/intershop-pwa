import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * Type for an input field of type 'password'.
 *
 * @defaultWrappers form-field-horizontal & validation
 *
 * @usageNotes
 * Defines some default validators and messages. These can be overriden but if you just want an input
 * field of type 'password', consider using ``text-input-field``.
 */
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
      password: 'form.password.error.invalid',
      required: 'form.password.error.required',
      equalTo: 'form.password.error.equalTo',
      ...field.validation.messages,
    };
  }
}
