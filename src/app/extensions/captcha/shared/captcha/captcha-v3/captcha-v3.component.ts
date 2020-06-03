import { ChangeDetectionStrategy, Component, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  SitekeyProviderService,
  getSynchronizedSiteKey,
} from '../../../services/sitekey-provider/sitekey-provider.service';

/**
 * The Captcha V3 Component
 *
 * Displays a captcha widget (V3) and saves the response token in the given form. It should only be used by {@link CaptchaComponent}
 */
@Component({
  selector: 'ish-captcha-v3',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaV3Component implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;

  private destroy$ = new Subject();

  constructor(private recaptchaV3Service: ReCaptchaV3Service) {}

  ngOnInit() {
    this.parentForm.get('captchaAction').setValidators([Validators.required]);

    this.recaptchaV3Service
      .execute(this.parentForm.get('captchaAction').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(token => {
        this.parentForm.get('captcha').setValue(token);
        this.parentForm.get('captcha').updateValueAndValidity();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}

@NgModule({
  imports: [RecaptchaV3Module],
  declarations: [CaptchaV3Component],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useFactory: getSynchronizedSiteKey,
      deps: [SitekeyProviderService],
    },
  ],
})
export class CaptchaV3ComponentModule {}
