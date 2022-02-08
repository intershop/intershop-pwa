import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * The default wrapper for displaying fields with labels.
 *
 * @templateOption **label** - the label to be displayed
 * @templateOption **labelClass** - the css class to be applied to the ``<label>`` tag.
 * @templateOption **fieldClass** - the css class to be applied to a div around the ``#fieldComponent`` template.
 * @templateOption **required** - apart from formly-internal validation logic, the required option is used here to display a star marker.
 * @templateOption **hideRequiredMarker** - used to not show the required star while still marking the field as required.
 *
 * @usageNotes
 * While validation is mostly handled by the validation wrapper, the label still needs to be styled according to error state.
 * This is why this wrapper uses the showError attribute to conditionally apply a class.
 */
@Component({
  selector: 'ish-horizontal-wrapper',
  templateUrl: './horizontal-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HorizontalWrapperComponent extends FieldWrapper {
  dto = {
    labelClass: 'col-md-4',
    fieldClass: 'col-md-8',
  };
  get keyString() {
    return this.field.key as string;
  }
}
