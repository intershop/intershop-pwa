import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { markAsDirtyRecursive } from '../../../../shared/forms/utils/form-utils';

/**
 * The Forgot Password Form Component displays a Forgot Password form and triggers the submit.
 *
 * @example
 * <ish-forgot-password-form
 *               (submitPasswordReminder)="requestPasswordReminder($event)">
 * ></ish-forgot-password-form>
 */
@Component({
  selector: 'ish-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordFormComponent implements OnInit {
  /**
   * Submit the form data to trigger the request for a password reminder.
   */
  @Output() submitPasswordReminder = new EventEmitter<PasswordReminder>();

  form: FormGroup;
  submitted = false;

  captchaEnabled: boolean;

  constructor(private featureToggle: FeatureToggleService) {}

  ngOnInit() {
    this.captchaEnabled = this.featureToggle.enabled('captcha');
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, CustomValidators.email]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      captcha: new FormControl(undefined, this.captchaEnabled ? Validators.required : []),
    });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    this.submitPasswordReminder.emit(this.form.value);
  }
}
