import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { User } from 'ish-core/models/user/user.model';
import { UpdateUser, getLoggedInUser, getUserError, getUserLoading } from 'ish-core/store/user';

/**
 * The Account Profile Email Page Container Component renders a page where the user can change his email using the {@link AccountProfileEmailPageComponent}
 */
@Component({
  selector: 'ish-account-profile-email-page-container',
  templateUrl: './account-profile-email-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileEmailPageContainerComponent {
  currentUser$ = this.store.pipe(select(getLoggedInUser));
  userError$ = this.store.pipe(select(getUserError));
  userLoading$ = this.store.pipe(select(getUserLoading));

  constructor(private store: Store<{}>) {}

  updateUserEmail(user: User) {
    this.store.dispatch(new UpdateUser({ user, successMessage: 'account.profile.update_email.message' }));
  }
}
