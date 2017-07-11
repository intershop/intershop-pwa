import { Component, Output, EventEmitter } from '@angular/core'


@Component({
  selector: 'is-captcha',
  templateUrl: './captcha.component.html'
})

export class CaptchaComponent {
  @Output() invalidCaptcha = true;
  @Output() captchaEmitter: EventEmitter<boolean> = new EventEmitter();
  resolved(captchaResponse: string) {
    this.invalidCaptcha = false;
    this.captchaEmitter.emit(this.invalidCaptcha);
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }
}
