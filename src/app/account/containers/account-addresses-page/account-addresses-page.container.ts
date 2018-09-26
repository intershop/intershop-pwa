import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { LoadAddresses, getAllAddresses } from '../../../checkout/store/addresses';
import { getAddressesLoading } from '../../../checkout/store/addresses/addresses.selectors';
import { getLoggedInUser } from '../../../core/store/user';

/**
 * The Account Addresses Page Container Component renders the account addresses page of a logged in user using the {@link AccountAddressesPageComponent}
 *
 */
@Component({
  templateUrl: './account-addresses-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAddressesPageContainerComponent implements OnInit {
  addresses$ = this.store.pipe(select(getAllAddresses));
  user$ = this.store.pipe(select(getLoggedInUser));
  loading$ = this.store.pipe(select(getAddressesLoading));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadAddresses());
  }
}
