import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  templateUrl: './account-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfilePageComponent implements OnInit {
  user$: Observable<User>;
  customer$: Observable<Customer>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.customer$ = this.accountFacade.customer$;
  }
}
