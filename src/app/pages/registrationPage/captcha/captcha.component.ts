import { Component, Output, EventEmitter } from '@angular/core'


@Component({
  selector: 'is-captcha',
  templateUrl: './captcha.component.html'
})

export class CaptchaComponent {
  @Output() isValid: EventEmitter<boolean> = new EventEmitter();
  resolved(captchaResponse: string) {
    this.isValid.emit(true);
  }
}
