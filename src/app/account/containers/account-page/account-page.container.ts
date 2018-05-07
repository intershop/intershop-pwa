import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInUser } from '../../../core/store/user';
import { PrivateCustomer } from '../../../models/customer/private-customer.model';
import { SmbCustomerUser } from '../../../models/customer/smb-customer-user.model';

@Component({
  templateUrl: './account-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageContainerComponent implements OnInit {
  user$: Observable<PrivateCustomer | SmbCustomerUser>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
  }
}
