import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-text-input-field',
  templateUrl: './text-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputFieldComponent extends FieldType {
  formControl: FormControl;

  textInputFieldTypes = ['text', 'email', 'password', 'tel'];

  prePopulate(field: FormlyFieldConfig) {
    if (!field.templateOptions?.type) {
      field.templateOptions.type = 'text';
      return;
    }

    if (!this.textInputFieldTypes.includes(field.templateOptions.type)) {
      throw new Error(
        'parameter <templateOptions.type> is not valid for TextInputFieldComponent, only text, email, password or number are possible values'
      );
    }
  }
}
