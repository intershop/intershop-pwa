import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, combineLatest, map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
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
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm, AsyncPipe, TranslatePipe],
})
export class RequestReminderFormComponent implements OnInit {
  /**
   * Submit the form data to trigger the request for a password reminder.
   */
  @Output() submitPasswordReminder = new EventEmitter<PasswordReminder>();
  requestReminderForm = new UntypedFormGroup({});
  fields$: Observable<FormlyFieldConfig[]>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit(): void {
    this.fields$ = combineLatest([
      this.appFacade.serverSetting$<boolean>('captcha.forgotPassword'),
      this.appFacade.serverSetting$<boolean>('services.ReCaptchaV2ServiceDefinition.runnable'),
    ]).pipe(
      map(([isCaptchaV2, isCaptchaTopicEnabled]) => [
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
            required: isCaptchaV2 && isCaptchaTopicEnabled,
            fieldClass: 'offset-md-4 col-md-8',
          },
        },
      ])
    );
  }

  submitForm() {
    if (this.requestReminderForm.valid) {
      this.submitPasswordReminder.emit(this.requestReminderForm.value);
    }
  }
}
