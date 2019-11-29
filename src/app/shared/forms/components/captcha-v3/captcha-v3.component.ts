import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class CaptchaV3Component implements OnChanges, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() actionControlName: string;

  private destroy$ = new Subject();

  constructor(private recaptchaV3Service: ReCaptchaV3Service) {}

  /* write the captcha response token in the captcha form field */
  ngOnChanges(c: SimpleChanges) {
    if (this.parentForm && c.parentForm.isFirstChange()) {
      this.recaptchaV3Service
        .execute(this.parentForm.get(this.actionControlName).value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(token => this.parentForm.get(this.controlName).setValue(token));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
