// NEEDS_WORK:
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-captcha',
  templateUrl: './captcha.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaComponent {
  @Input() parentForm: FormGroup;
  @Input() controlName: string;

  /**
   * Emits true when captcha is resolved as true
   * @param  {string} captchaResponse
   */
  // tslint:disable-next-line:no-unused
  resolved(captchaResponse: string) {
    this.parentForm.get(this.controlName).setValue(true);
  }
}
