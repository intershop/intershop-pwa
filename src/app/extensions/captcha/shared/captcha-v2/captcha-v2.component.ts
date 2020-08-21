import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { Observable } from 'rxjs';

import { CaptchaFacade } from '../../facades/captcha.facade';

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
export class CaptchaV2Component implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() cssClass: string;

  captchaSiteKey$: Observable<string>;

  constructor(private captchaFacade: CaptchaFacade) {}

  ngOnInit() {
    this.captchaSiteKey$ = this.captchaFacade.captchaSiteKey$;

    this.parentForm.get('captchaAction').setValue(undefined);
    this.formControl.updateValueAndValidity();
  }

  /**
   * writes the captcha response token in the captcha form field
   */
  resolved(captchaResponse: string) {
    this.formControl.setValue(captchaResponse);
  }

  private get formControl(): AbstractControl {
    return this.parentForm?.get('captcha');
  }

  get hasError(): boolean {
    return this.formControl?.invalid && this?.formControl.dirty;
  }
}

@NgModule({
  declarations: [CaptchaV2Component],
  imports: [RecaptchaModule, CommonModule, TranslateModule],
})
export class CaptchaV2ComponentModule {}
