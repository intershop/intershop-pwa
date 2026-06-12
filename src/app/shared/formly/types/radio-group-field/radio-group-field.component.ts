import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type that will render radio buttons in a line.
 */
@Component({
  selector: 'ish-radio-group-field',
  templateUrl: './radio-group-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupFieldComponent extends FieldType<FieldTypeConfig> {}
