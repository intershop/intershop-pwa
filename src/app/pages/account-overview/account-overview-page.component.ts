import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Overview Page Container Component renders the account overview page of a logged in user using the {@link AccountOverviewPageComponent}
 *
 */
@Component({
  templateUrl: './account-overview-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewPageComponent implements OnInit {
  user$: Observable<User>;
  customer$: Observable<Customer>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.customer$ = this.accountFacade.customer$;
  }
}
