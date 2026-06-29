import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

import { ValidationIconsComponent } from 'ish-shared/formly/components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';

/**
 *  Wrapper to provide validation feedback and styling to fields.
 *
 *  @props **required** - special validation case that is considered.
 *
 * @usageNotes
 * This wrapper uses the ``<ish-validation-message>`` and  ``<ish-validation-icons>`` components  to display validation messages
 * and icons depending on the fields validity as well as provide some necessary styling.
 * Refer to the components' documentation for more information.
 */
@Component({
  selector: 'ish-validation-wrapper',
  imports: [NgClass, ValidationIconsComponent, ValidationMessageComponent],
  standalone: true,
  templateUrl: './validation-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidationWrapperComponent extends FieldWrapper {
  showValidationIcons() {
    return (
      Object.keys(this.field.validators ?? {}).length ||
      Object.keys(this.field.asyncValidators ?? {}).length ||
      this.field.props?.required
    );
  }
}
