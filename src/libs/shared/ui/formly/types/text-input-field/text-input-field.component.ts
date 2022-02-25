import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Type for a basic input field
 *
 * @templateOption **type** supports all text types; 'text' (default), 'email', 'password', 'tel'
 *
 * @defaultWrappers form-field-horizontal & validation
 */
@Component({
  selector: 'ish-text-input-field',
  templateUrl: './text-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputFieldComponent extends FieldType<FieldTypeConfig> {
  textInputFieldTypes = ['text', 'email', 'password', 'tel'];

  onPopulate(field: FormlyFieldConfig) {
    if (!field.templateOptions?.type) {
      field.templateOptions.type = 'text';
      return;
    }

    if (!this.textInputFieldTypes.includes(field.templateOptions.type)) {
      throw new Error(
        'parameter <templateOptions.type> is not valid for TextInputFieldComponent, only text, email, password and tel are possible values'
      );
    }
  }
}
