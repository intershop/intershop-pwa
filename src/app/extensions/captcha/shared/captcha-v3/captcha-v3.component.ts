// eslint-disable-next-line max-classes-per-file
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  NgModule,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha-2';
import { EMPTY, fromEvent, race, timer } from 'rxjs';
import { catchError, exhaustMap, filter, map, tap } from 'rxjs/operators';

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
export class CaptchaV3Component implements OnInit, AfterViewInit {
  @Input({ required: true }) parentForm: FormGroup;

  private tokenReady = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit() {
    this.parentForm.get('captchaAction').setValidators([Validators.required]);
  }

  ngAfterViewInit() {
    if (SSR) {
      return;
    }

    const formElement = this.elementRef.nativeElement.closest('form');
    if (!formElement) {
      return;
    }

    // Intercept form submit in capture phase: block until a fresh reCAPTCHA token is obtained,
    // then re-trigger the submit so Angular's (ngSubmit) fires with the token in place.
    let pendingSubmitter: HTMLElement;
    fromEvent<SubmitEvent>(formElement, 'submit', { capture: true })
      .pipe(
        filter(event => this.interceptSubmit(event)),
        tap(event => {
          pendingSubmitter = event.submitter;
          event.preventDefault();
          event.stopPropagation();
        }),
        exhaustMap(() => this.requestToken()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(token => {
        this.applyTokenAndResubmit(token, formElement, pendingSubmitter);
        pendingSubmitter = undefined;
      });
  }

  private interceptSubmit(_event: SubmitEvent): boolean {
    if (this.tokenReady) {
      this.tokenReady = false;
      return false;
    }
    // Clear previous captcha errors so they don't block a retry
    this.parentForm.get('captcha').setErrors(undefined);
    return this.parentForm.valid;
  }

  private requestToken() {
    const token$ = this.recaptchaV3Service.execute(this.parentForm.get('captchaAction').value).pipe(whenTruthy());
    const timeout$ = timer(5000).pipe(
      map(() => {
        throw new Error('reCAPTCHA token request timed out');
      })
    );

    return race(token$, timeout$).pipe(catchError(() => EMPTY));
  }

  private applyTokenAndResubmit(token: string, formElement: HTMLFormElement, submitter: HTMLElement) {
    this.parentForm.get('captcha').setValue(token);
    this.parentForm.get('captcha').updateValueAndValidity();
    this.tokenReady = true;
    formElement.requestSubmit(submitter);
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
