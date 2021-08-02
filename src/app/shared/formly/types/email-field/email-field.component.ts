import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Type for an input field with predefined validators.
 *
 * @defaultWrappers form-field-horizontal & validation
 *
 */
@Component({
  selector: 'ish-email-field',
  templateUrl: './email-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailFieldComponent extends FieldType {
  formControl: FormControl;
  prePopulate(field: FormlyFieldConfig) {
    field.validators = field.validators ?? {};
    field.validators.validation = [...(field.validators.validation ?? []), Validators.email];

    field.validation = field.validation ?? {};
    field.validation.messages = {
      email: 'form.email.error.invalid',
      required: 'form.email.error.required',
      ...field.validation?.messages,
    };
  }
}
