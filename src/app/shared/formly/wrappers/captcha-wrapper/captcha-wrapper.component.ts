import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';

/**
 *  Wrapper to provide validation feedback and styling to fields.
 *
 *  @props **required** - special validation case that is considered.
 *
 * @usageNotes
 * This wrapper uses the ``<ish-validation-message>`` components to display validation messages
 * depending on the fields validity as well as provide some necessary styling.
 * Refer to the components' documentation for more information.
 */
@Component({
  selector: 'ish-captcha-wrapper',
  templateUrl: './captcha-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CaptchaWrapperComponent extends FieldWrapper {
  captchaField: FormlyFieldConfig;

  hasCaptchaError() {
    if (
      this.field.type === 'ish-captcha-field' &&
      this.field?.form?.get(this.field.key as string)?.errors &&
      this.field.options.parentForm?.submitted
    ) {
      this.captchaField = {
        ...this.field,
        formControl: this.field.form.get(this.field.key as string),
        validation: {
          messages: { required: 'recaptcha.v2.incorrect.error' },
        },
      };
      return true;
    }
    return false;
  }
}
