import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

/**
 * Type to simply display a text value with optional styling
 *
 * @templateOption **inputClass** a class that will be used to style the div around the text
 */
@Component({
  selector: 'ish-plain-text-field',
  templateUrl: './plain-text-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlainTextFieldComponent extends FieldType {
  get textValue() {
    return this.form.get(this.field.key as string)?.value;
  }
}
