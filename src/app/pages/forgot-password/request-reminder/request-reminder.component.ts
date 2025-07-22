import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';

/**
 * The Request Reminder Component handles the interaction for requesting a password reminder email.
 * See also {@link RequestReminderFormComponent}.
 */
@Component({
  selector: 'ish-request-reminder',
  templateUrl: './request-reminder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestReminderComponent implements OnInit {
  success$: Observable<boolean>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  isCaptchaRequired$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade, private appFacade: AppFacade) {}

  ngOnInit(): void {
    this.success$ = this.accountFacade.passwordReminderSuccess$;
    this.error$ = this.accountFacade.passwordReminderError$;
    this.loading$ = this.accountFacade.userLoading$;

    this.accountFacade.resetPasswordReminder();
    this.isCaptchaRequired$ = this.appFacade
      .serverSetting$<boolean>('services.ReCaptchaV2ServiceDefinition.runnable')
      .pipe(mergeMap(isCaptchaV2 => isCaptchaV2 && this.appFacade.serverSetting$<boolean>('captcha.forgotPassword')));
  }

  requestPasswordReminder(data: PasswordReminder) {
    this.accountFacade.requestPasswordReminder(data);
  }
}
