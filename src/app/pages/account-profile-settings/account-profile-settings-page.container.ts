import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getLoggedInUser } from 'ish-core/store/user';

@Component({
  templateUrl: './account-profile-settings-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileSettingsPageContainerComponent {
  user$ = this.store.pipe(select(getLoggedInUser));

  constructor(private store: Store<{}>) {}
}
