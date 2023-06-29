import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type for a basic textarea field
 *
 * @props **ariaLabel** adds an aria-label to the component for better accessibility, recommended if there is no associated label
 * @props **cols** - the amount of columns the textarea should have
 * @props **rows** - the amount of rows the textarea should have
 *
 * @defaultWrappers form-field-horizontal & textarea-description & validation
 *
 * @usageNotes
 * See the textarea-description wrapper for more info on the relevant props.
 */
@Component({
  selector: 'ish-textarea-field',
  templateUrl: './textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFieldComponent extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    props: {
      cols: 1,
      rows: 1,
    },
  };
}
