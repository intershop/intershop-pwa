import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Basic type for radio buttons
 *
 * @templateOption **label** - the text that should be shown next to the radio button
 * @templateOptions **value** - the value that should be associated with this radio button
 *
 * @defaultWrappers form-field-checkbox-horizontal
 *
 * @usageNotes
 * Link multiple radio buttons together by using the same key for each.
 * Refer to the form-field-checkbox-horizontal wrapper for more info on relevant templateOptions.
 *
 */
@Component({
  selector: 'ish-radio-field',
  templateUrl: './radio-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioFieldComponent extends FieldType<FieldTypeConfig> {}
