import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { LoadAddresses, getAllAddresses } from '../../../checkout/store/addresses';
import { getAddressesLoading } from '../../../checkout/store/addresses/addresses.selectors';
import { getLoggedInUser } from '../../../core/store/user';
import { Address } from '../../../models/address/address.model';
import { User } from '../../../models/user/user.model';

/**
 * The Account Addresses Page Container Component renders the account addresses page of a logged in user using the {@link AccountAddressesPageComponent}
 *
 */
@Component({
  templateUrl: './account-addresses-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAddressesPageContainerComponent implements OnInit {
  addresses$: Observable<Address[]>;
  user$: Observable<User>;
  loading$: Observable<boolean>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadAddresses());
    this.addresses$ = this.store.pipe(select(getAllAddresses));
    this.loading$ = this.store.pipe(select(getAddressesLoading));
    this.user$ = this.store.pipe(select(getLoggedInUser));
  }
}
