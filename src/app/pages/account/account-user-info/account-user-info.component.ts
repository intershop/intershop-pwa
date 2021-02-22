import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-account-user-info',
  templateUrl: './account-user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountUserInfoComponent implements OnInit {
  isBusinessUser$: Observable<boolean>;
  user$: Observable<User>;
  customer$: Observable<Customer>;
  roles$: Observable<string>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.isBusinessUser$ = this.accountFacade.customer$.pipe(map(user => !!user?.isBusinessCustomer));
    this.user$ = this.accountFacade.user$;
    this.customer$ = this.accountFacade.customer$;
    this.roles$ = this.accountFacade.roles$.pipe(
      map(roles => roles.map(role => role.displayName)),
      map(a => a.join(', '))
    );
  }
}
