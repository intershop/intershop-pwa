import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  templateUrl: './account-profile-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfilePageContainerComponent implements OnInit {
  user$: Observable<User>;
  customer$: Observable<Customer>;
  userSuccessMessage$: Observable<string>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.customer$ = this.accountFacade.customer$;
    this.userSuccessMessage$ = this.accountFacade.userSuccessMessage$;
  }
}
