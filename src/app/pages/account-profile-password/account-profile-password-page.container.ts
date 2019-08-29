import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { UpdateUserPassword, getUserError, getUserLoading } from 'ish-core/store/user';

/**
 * The Account Profile Password Page Container Component renders a page where the user can change his password using the {@link AccountProfilePasswordPageComponent}
 *
 */
@Component({
  selector: 'ish-account-profile-password-page-container',
  templateUrl: './account-profile-password-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfilePasswordPageContainerComponent {
  userError$ = this.store.pipe(select(getUserError));
  userLoading$ = this.store.pipe(select(getUserLoading));

  constructor(private store: Store<{}>) {}

  updateUserPassword(data: { password: string; currentPassword: string }) {
    this.store.dispatch(new UpdateUserPassword(data));
  }
}
