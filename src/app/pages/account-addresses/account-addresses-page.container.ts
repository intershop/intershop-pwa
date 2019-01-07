import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import {
  CreateCustomerAddress,
  DeleteCustomerAddress,
  LoadAddresses,
  getAddressesError,
  getAddressesLoading,
  getAllAddresses,
} from 'ish-core/store/checkout/addresses';
import { getLoggedInUser } from 'ish-core/store/user';

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
  error$ = this.store.pipe(select(getAddressesError));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadAddresses());
  }

  createCustomerAddress(address: Address) {
    this.store.dispatch(new CreateCustomerAddress(address));
  }

  deleteCustomerAddress(addressId: string) {
    this.store.dispatch(new DeleteCustomerAddress({ addressId }));
  }
}
