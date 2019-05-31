import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getLoggedInCustomer, getLoggedInUser, getUserSuccessMessage } from 'ish-core/store/user';

@Component({
  templateUrl: './account-profile-settings-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileSettingsPageContainerComponent {
  user$ = this.store.pipe(select(getLoggedInUser));
  customer$ = this.store.pipe(select(getLoggedInCustomer));
  userSuccessMessage$ = this.store.pipe(select(getUserSuccessMessage));

  constructor(private store: Store<{}>) {}
}
