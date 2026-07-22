// eslint-disable-next-line max-classes-per-file
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha-2';
import { Observable } from 'rxjs';

import { CaptchaFacade } from '../../facades/captcha.facade';

/**
 * The Captcha V2 Component
 *
 * Displays a captcha form control (V2) and saves the response token in the given form. It should only be used by {@link CaptchaComponent}
 */
@Component({
  selector: 'ish-captcha-v2',
  standalone: false,
  templateUrl: './captcha-v2.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CaptchaV2Component implements OnInit {
  @Input({ required: true }) parentForm: FormGroup;
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
}

@NgModule({
  declarations: [CaptchaV2Component],
  imports: [CommonModule, RecaptchaModule, TranslatePipe],
})
export class CaptchaV2ComponentModule {}
