import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

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

  submitted = false;

  requestReminderForm = new FormGroup({});
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = [
      {
        key: 'email',
        type: 'ish-email-field',
        templateOptions: {
          label: 'account.forgotdata.email.label',
          hideRequiredMarker: true,
          required: true,
        },
        validation: {
          messages: {
            required: 'account.email.error.required',
          },
        },
      },
      {
        type: 'ish-captcha-field',
        templateOptions: {
          topic: 'forgotPassword',
        },
      },
    ];
  }

  get buttonDisabled() {
    return this.requestReminderForm.invalid && this.submitted;
  }

  submitForm() {
    if (this.requestReminderForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.requestReminderForm);
      return;
    }

    this.submitPasswordReminder.emit(this.requestReminderForm.value);
  }
}
