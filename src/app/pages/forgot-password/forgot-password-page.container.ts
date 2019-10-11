import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';

/**
 * The Forgot Password Page Container handles the password reminder interaction with the server and state
 * and displays the Forgot Password Page Component {@link ForgotPasswordPageComponent} with the Forgot Password Form.
 */
@Component({
  templateUrl: './forgot-password-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageContainerComponent implements OnInit {
  passwordReminderSuccess$: Observable<boolean>;
  passwordReminderError$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.passwordReminderSuccess$ = this.accountFacade.passwordReminderSuccess$;
    this.passwordReminderError$ = this.accountFacade.passwordReminderError$;
    this.loading$ = this.accountFacade.userLoading$;

    this.accountFacade.resetPasswordReminder();
  }

  requestPasswordReminder(data: PasswordReminder) {
    this.accountFacade.requestPasswordReminder(data);
  }
}
