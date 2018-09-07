import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getLoggedInUser } from '../../../core/store/user';
import { User } from '../../../models/user/user.model';

/**
 * The Account Overview Page Container Component renders the account overview page of a logged in user using the {@link AccountOverviewPageComponent}
 *
 */
@Component({
  templateUrl: './account-overview-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewPageContainerComponent implements OnInit {
  user$: Observable<User>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
  }
}
