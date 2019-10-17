import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CAPTCHA_SITE_KEY } from 'ish-core/configurations/injection-keys';

/**
 * The Captcha V2 Component
 *
 * Displays a captcha form control (V2) and saves the response token in the given form. It should only be used by {@link CaptchaComponent}
 */
@Component({
  selector: 'ish-captcha-v2',
  templateUrl: './captcha-v2.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CaptchaV2Component {
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() cssClass: string;

  constructor(@Inject(CAPTCHA_SITE_KEY) public captchaSiteKey) {}

  /* writes the captcha response token in the captcha farm field */
  resolved(captchaResponse: string) {
    this.parentForm.get(this.controlName).setValue(captchaResponse);
  }

  get hasError(): boolean {
    return (
      this.parentForm && this.parentForm.get(this.controlName).invalid && this.parentForm.get(this.controlName).dirty
    );
  }
}
