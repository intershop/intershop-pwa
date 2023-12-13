import { ChangeDetectionStrategy, Component, DestroyRef, Input, NgModule, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { timer } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { DirectivesModule } from 'ish-core/directives.module';
import { whenTruthy } from 'ish-core/utils/operators';

import {
  SitekeyProviderService,
  getSynchronizedSiteKey,
} from '../../exports/sitekey-provider/sitekey-provider.service';

/**
 * The Captcha V3 Component
 *
 * Displays a captcha widget (V3) and saves the response token in the given form. It should only be used by {@link CaptchaComponent}
 */
@Component({
  selector: 'ish-captcha-v3',
  templateUrl: './captcha-v3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaV3Component implements OnInit {
  @Input({ required: true }) parentForm: FormGroup;

  private destroyRef = inject(DestroyRef);

  constructor(private recaptchaV3Service: ReCaptchaV3Service) {}

  ngOnInit() {
    this.parentForm.get('captchaAction').setValidators([Validators.required]);

    // as soon as the form gets valid request a captcha token every 2 minutes
    if (!SSR) {
      this.parentForm.statusChanges
        .pipe(
          filter(status => status === 'VALID'),
          take(1),
          switchMap(() =>
            timer(0, 2 * (60 - 3) * 1000).pipe(
              switchMap(() => this.recaptchaV3Service.execute(this.parentForm.get('captchaAction').value))
            )
          ),
          whenTruthy(),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(token => {
          this.parentForm.get('captcha').setValue(token);
          this.parentForm.get('captcha').updateValueAndValidity();
        });

      // if the captcha is set to undefined from outside request a captcha token
      this.parentForm
        .get('captcha')
        .valueChanges.pipe(
          filter(token => token === undefined),
          switchMap(() => this.recaptchaV3Service.execute(this.parentForm.get('captchaAction').value)),
          whenTruthy(),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(token => {
          this.parentForm.get('captcha').setValue(token);
          this.parentForm.get('captcha').updateValueAndValidity();
        });
    }
  }
}

@NgModule({
  imports: [DirectivesModule, RecaptchaV3Module, TranslateModule],
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
