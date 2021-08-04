import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * Wrapper that works with checkboxes and radio buttons.
 *
 * @templateOption **label** - the label to be displayed
 * @templateOption **labelClass** - the css class to be applied to the ``<label>`` tag. Will use default value if not provided.
 * @templateOption **fieldClass** - the css class to be applied to a div around the ``#fieldComponent`` template. Will use default value if not provided.
 * @templateOption **tooltip** - tooltip information that will be passed to the ``<ish-tooltip>`` component.
 *  Refer to the component documentation for more info.
 *
 * @usageNotes
 * Because of the unique nature of checkbox and radio button fields, the standard horizontal and validation wrappers can't be used.
 * Instead, this wrapper handles both presentation and validation of the fields :
 * * It will apply styling and provide error messages according to the error state.
 * * It will show  a label if desired and supply the necessary bootstrap classes (``form-check`` & ``form-check-label``)
 * * It will apply different classes depending on whether the field type is a checkbox or radio button
 * * It handles the display of tooltips via the ``<ish-tooltip>`` component
 */
@Component({
  selector: 'ish-horizontal-checkbox-wrapper',
  templateUrl: './horizontal-checkbox-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HorizontalCheckboxWrapperComponent extends FieldWrapper {
  dto = {
    labelClass: '',
    fieldClass: 'offset-md-4 col-md-8',
  };
  get keyString() {
    return this.field.key as string;
  }
}
