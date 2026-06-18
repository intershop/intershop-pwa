// eslint-disable-next-line max-classes-per-file
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Input, NgModule, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha-2';
import { EMPTY, fromEvent } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

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

  private tokenReady = false;

  constructor(
    private destroyRef: DestroyRef,
    private elementRef: ElementRef,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit() {
    this.parentForm.get('captchaAction').setValidators([Validators.required]);

    if (!SSR) {
      // Intercept form submit in capture phase: block until a fresh token is available
      const formElement = this.elementRef.nativeElement.closest('form');

      if (formElement) {
        const captureOptions: AddEventListenerOptions = { capture: true };
        let pendingSubmitter: HTMLElement | undefined;
        fromEvent<SubmitEvent>(formElement, 'submit', captureOptions)
          .pipe(
            filter(event => {
              if (this.tokenReady) {
                // Token is ready — let the submit propagate to Angular's (ngSubmit)
                this.tokenReady = false;
                return false;
              }
              pendingSubmitter = (event.submitter as HTMLElement) || undefined;

              // Block the submit until we have a fresh token
              event.preventDefault();
              event.stopPropagation();
              return true;
            }),
            switchMap(() =>
              this.recaptchaV3Service.execute(this.parentForm.get('captchaAction').value).pipe(
                whenTruthy(),
                catchError(() => {
                  pendingSubmitter = undefined;
                  return EMPTY;
                })
              )
            ),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(token => {
            this.parentForm.get('captcha').setValue(token);
            this.parentForm.get('captcha').updateValueAndValidity();
            this.tokenReady = true;
            // Re-trigger submit — this time it will pass through
            formElement.requestSubmit(pendingSubmitter);
            pendingSubmitter = undefined;
          });
      }
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
