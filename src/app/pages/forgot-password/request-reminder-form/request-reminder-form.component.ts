import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Request Reminder Form Component displays a Forgot Password Request Reminder form and triggers the submit.
 *
 * @example
 * <ish-request-reminder-form
 *               (submitPasswordReminder)="requestPasswordReminder($event)"
 * ></ish-request-reminder-form>
 */
@Component({
  selector: 'ish-request-reminder-form',
  templateUrl: './request-reminder-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestReminderFormComponent implements OnInit {
  /**
   * Submit the form data to trigger the request for a password reminder.
   */
  @Output() submitPasswordReminder = new EventEmitter<PasswordReminder>();

  form: FormGroup;
  submitted = false;

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, CustomValidators.email]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      captcha: new FormControl(''),
      captchaAction: new FormControl('forgot_password'),
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
