import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type for a password field, containing an input field with type="password" and a reveal button to show the password in plain text.
 * For security reasons the reveal button is only available after the user has entered the first character into the field.
 * The button will be hidden after the user moves focus outside the field.
 * The reveal button functionality follows the Microsoft design guidelines for password fields: https://learn.microsoft.com/en-us/microsoft-edge/web-platform/password-reveal#visibility-of-the-control
 *
 * @defaultWrappers form-field-horizontal & validation
 */
@Component({
  selector: 'ish-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFieldComponent extends FieldType<FieldTypeConfig> {
  showPassword = false;
  showButton = false;
  // set the reveal button to false to always hide the reveal button
  private revealButton = true;

  onInput() {
    if (this.revealButton && this.formControl.value.length === 1) {
      // enable the button only if the input was previously empty and user inserts the first character
      this.showButton = true;
    }
    if (!this.formControl.value.length) {
      this.showButton = false;
    }
  }

  onFocusOutside(isFocusedOutside: boolean) {
    if (isFocusedOutside) {
      // hide the password and disable the button when focus is outside the wrapper
      this.showPassword = false;
      this.showButton = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
