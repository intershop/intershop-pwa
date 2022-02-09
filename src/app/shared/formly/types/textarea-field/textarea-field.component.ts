import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type for a basic textarea field
 *
 * @templateOptions **cols** - the amount of columns the textarea should have
 * @templateOptions **rows** - the amount of rows the textarea should have
 *
 * @defaultWrappers form-field-horizontal & textarea-description & validation
 *
 * @usageNotes
 * See the textarea-description wrapper for more info on the relevant templateOptions.
 */
@Component({
  selector: 'ish-textarea-field',
  templateUrl: './textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFieldComponent extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    templateOptions: {
      cols: 1,
      rows: 1,
    },
  };
}
