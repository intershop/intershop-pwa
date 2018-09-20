import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getLoggedInUser } from '../../../core/store/user';

/**
 * The Account Overview Page Container Component renders the account overview page of a logged in user using the {@link AccountOverviewPageComponent}
 *
 */
@Component({
  templateUrl: './account-overview-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewPageContainerComponent {
  user$ = this.store.pipe(select(getLoggedInUser));

  constructor(private store: Store<{}>) {}
}
