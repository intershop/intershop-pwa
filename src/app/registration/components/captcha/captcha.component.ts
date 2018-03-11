// NEEDS_WORK:
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-captcha',
  templateUrl: './captcha.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CaptchaComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() controlName: string;

  ngOnInit() { }

  /**
   * Emits true when captcha is resolved as true
   * @param  {string} captchaResponse
   */
  resolved(captchaResponse: string) {
    this.parentForm.get(this.controlName).setValue(true);
  }

}
