import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 *  Wrapper to provide validation feedback and styling to fields.
 *
 *  @templateOption **required** - special validation case that is considered.
 *
 * @usageNotes
 * This wrapper uses the ``<ish-validation-message>`` and  ``<ish-validation-icons>`` components  to display validation messages
 * and icons depending on the fields validity as well as provide some necessary styling.
 * Refer to the components' documentation for more information.
 */
@Component({
  selector: 'ish-validation-wrapper',
  templateUrl: './validation-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidationWrapperComponent extends FieldWrapper {
  showValidationIcons() {
    return (
      Object.keys(this.field.validators ?? {}).length ||
      Object.keys(this.field.asyncValidators ?? {}).length ||
      this.field.templateOptions?.required
    );
  }
}
