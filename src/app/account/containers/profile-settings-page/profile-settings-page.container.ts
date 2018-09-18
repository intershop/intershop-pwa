import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getLoggedInUser } from '../../../core/store/user';

@Component({
  templateUrl: './profile-settings-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPageContainerComponent {
  user$ = this.store.pipe(select(getLoggedInUser));

  constructor(private store: Store<{}>) {}
}
