import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';

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

  requestReminderForm = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = [
      {
        key: 'email',
        type: 'ish-email-field',
        props: {
          label: 'account.forgotdata.email.label',
          hideRequiredMarker: true,
          required: true,
        },
      },
      {
        type: 'ish-captcha-field',
        props: {
          topic: 'forgotPassword',
        },
      },
    ];
  }

  submitForm() {
    if (this.requestReminderForm.valid) {
      this.submitPasswordReminder.emit(this.requestReminderForm.value);
    }
  }
}
