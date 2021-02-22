import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-captcha-field',
  templateUrl: './captcha-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaFieldComponent extends FieldType implements OnInit {
  ngOnInit() {
    this.registerControls();
  }

  private registerControls() {
    if (!this.form.get('captcha')) {
      this.form.addControl('captcha', new FormControl(''));
    }
    if (!this.form.get('captchaAction')) {
      this.form.addControl('captchaAction', new FormControl(this.to.topic));
    }
  }
}
