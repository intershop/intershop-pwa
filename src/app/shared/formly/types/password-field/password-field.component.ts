import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { ariaDescribedByIds } from 'ish-shared/forms/utils/form-utils';

/**
 * Type for a basic input field
 *
 * @props **ariaLabel** adds an aria-label to the component for better accessibility, recommended if there is no associated label
 * @props **label** - the text that should be shown next to the password field
 *
 * @defaultWrappers form-field-horizontal & validation
 */
@Component({
  selector: 'ish-password-field',
  templateUrl: './password-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFieldComponent extends FieldType<FieldTypeConfig> {
  showPassword = false;
  isButtonDisabled = true;

  onInput() {
    if (this.formControl.value.length === 1) {
      // enable the button only if the input was previously empty and user inserts the first character
      this.isButtonDisabled = false;
    }
  }

  onFocusOutside(isFocusedOutside: boolean) {
    if (isFocusedOutside) {
      // hide the password and disable the button when focus is outside the wrapper
      this.showPassword = false;
      this.isButtonDisabled = true;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get ariaDescribedByIds(): string | null {
    return ariaDescribedByIds(this.field.id, this.showError, this.props.customDescription);
  }
}
