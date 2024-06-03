import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Type for a basic input field
 *
 * @props **ariaLabel** adds an aria-label to the component for better accessibility, recommended if there is no associated label
 * @props **ariaLabelledby** can be used to link related information to the input field (like conditions for passwords)
 * @props **type** supports all text types; 'text' (default), 'email', 'password', 'tel'
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
    if (!field.props?.type) {
      field.props.type = 'text';
      return;
    }

    if (!this.textInputFieldTypes.includes(field.props.type)) {
      throw new Error(
        'parameter <props.type> is not valid for TextInputFieldComponent, only text, email, password and tel are possible values'
      );
    }
  }
}
