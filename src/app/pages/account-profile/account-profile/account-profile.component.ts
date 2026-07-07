import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-account-profile',
  standalone: false,
  templateUrl: './account-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileComponent {
  @Input({ required: true }) user: User;

  @Input() subscribedToNewsletter: boolean;

  loginType$: Observable<string>;

  constructor(private appFacade: AppFacade) {
    this.loginType$ = this.appFacade.serverSetting$<string>(
      'preferences.UserCredentialPreferences.UserRegistrationLoginType'
    );
  }
}
