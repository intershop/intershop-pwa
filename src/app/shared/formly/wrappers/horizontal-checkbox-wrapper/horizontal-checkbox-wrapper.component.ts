import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FieldTooltipComponent } from 'ish-shared/formly/components/field-tooltip/field-tooltip.component';
import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';

/**
 * Wrapper that works with checkboxes and radio buttons.
 *
 * @props **label** - the label to be displayed
 * @props **labelClass** - the css class to be applied to the ``<label>`` tag. Will use default value if not provided.
 * @props **fieldClass** - the css class to be applied to a div around the ``#fieldComponent`` template. Will use default value if not provided.
 * @props **tooltip** - tooltip information that will be passed to the ``<ish-tooltip>`` component.
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
  imports: [FieldTooltipComponent, NgClass, TranslatePipe, ValidationMessageComponent],
  standalone: true,
  templateUrl: './horizontal-checkbox-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HorizontalCheckboxWrapperComponent extends FieldWrapper {
  dprops = {
    labelClass: '',
    fieldClass: 'col-md-8',
    titleClass: 'col-md-4',
    noTitleClass: 'offset-md-4',
  };
  get keyString() {
    return this.field.key as string;
  }
}
