import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import {
  RequestPasswordReminder,
  ResetPasswordReminder,
  getPasswordReminderError,
  getPasswordReminderSuccess,
  getUserLoading,
} from 'ish-core/store/user';

/**
 * The Forgot Password Page Container handles the password reminder interaction with the server and state
 * and displays the Forgot Password Page Component {@link ForgotPasswordPageComponent} with the Forgot Password Form.
 */
@Component({
  templateUrl: './forgot-password-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageContainerComponent implements OnInit {
  passwordReminderSuccess$ = this.store.pipe(select(getPasswordReminderSuccess));
  passwordReminderError$ = this.store.pipe(select(getPasswordReminderError));
  loading$ = this.store.pipe(select(getUserLoading));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new ResetPasswordReminder());
  }

  requestPasswordReminder(data: PasswordReminder) {
    this.store.dispatch(new RequestPasswordReminder({ data }));
  }
}
