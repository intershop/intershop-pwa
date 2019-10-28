import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';

/**
 * The Forgot Password Page Component displays a Forgot Password page with a Forgot Password form. See also {@link ForgotPasswordFormComponent}.
 *
 * @example
 * <ish-forgot-password-page
 *               [success]="passwordReminderSuccess$ | async"
 *               [error]="passwordReminderError$ | async"
 *               (submitPasswordReminder)="requestPasswordReminder($event)"
 * ></ish-forgot-password-page>
 */
@Component({
  selector: 'ish-forgot-password',
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  /**
   * The success input indicates whether the request for a password reminder was successful or if the request form still needs to be displayed.
   */
  @Input() success: boolean;
  /**
   * The error input controls whether an error message needs to be displayed or not.
   */
  @Input() error: HttpError;
  /**
   * Submit the form data to trigger the request for a password reminder.
   */
  @Output() submitPasswordReminder = new EventEmitter<PasswordReminder>();

  securityQuestionEnabled = false;

  constructor(private featureToggle: FeatureToggleService) {
    this.securityQuestionEnabled = this.featureToggle.enabled('securityQuestion');
  }

  requestPasswordReminder(data: PasswordReminder) {
    this.submitPasswordReminder.emit(data);
  }
}
