import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * Type for an input field of type 'tel'.
 * @templateOption **maxLength** - defines the maximum length of the field
 *
 * @defaultWrappers form-field-horizontal & validation
 *  @usageNotes
 * Defines some default validators and messages. These can be overriden but if you just want an input
 * field of type 'tel', consider using ``text-input-field``.
 */
@Component({
  selector: 'ish-phone-field',
  templateUrl: './phone-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneFieldComponent extends FieldType {
  formControl: FormControl;

  prePopulate(field: FormlyFieldConfig) {
    field.validators = field.validators ?? {};
    field.validators.validation = [...(field.validators.validation ?? []), SpecialValidators.phone];

    field.validation = field.validation ?? {};
    field.validation.messages = {
      ...field.validation?.messages,
      phone: 'form.phone.error.invalid',
      required: 'form.phone.error.required',
    };
  }
}
