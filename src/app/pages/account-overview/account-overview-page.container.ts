import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/user';

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
  customer$ = this.store.pipe(select(getLoggedInCustomer));

  constructor(private store: Store<{}>) {}
}
