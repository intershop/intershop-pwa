import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'is-captcha',
  templateUrl: './captcha.component.html'
})

export class CaptchaComponent {
  @Output() isValid: EventEmitter<boolean> = new EventEmitter();

  /**
   * Emits true when captcha is resolved as true
   * @param  {string} captchaResponse
   */
  resolved(captchaResponse: string) {
    this.isValid.emit(true);
  }

}
