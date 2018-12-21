import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CAPTCHA_SITE_KEY } from 'ish-core/configurations/injection-keys';

@Component({
  selector: 'ish-captcha',
  templateUrl: './captcha.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaComponent {
  @Input() parentForm: FormGroup;
  @Input() controlName: string;

  constructor(@Inject(CAPTCHA_SITE_KEY) public captchaSiteKey) {}

  /**
   * Emits true when captcha is resolved as true
   * @param  {string} captchaResponse
   */
  resolved(captchaResponse: string) {
    this.parentForm.get(this.controlName).setValue(captchaResponse);
  }
}
