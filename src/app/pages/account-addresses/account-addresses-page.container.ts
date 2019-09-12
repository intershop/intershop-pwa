import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { User } from 'ish-core/models/user/user.model';
import {
  CreateCustomerAddress,
  DeleteCustomerAddress,
  LoadAddresses,
  getAddressesError,
  getAddressesLoading,
  getAllAddresses,
} from 'ish-core/store/addresses';
import { UpdateUser, getLoggedInUser, getUserError } from 'ish-core/store/user';

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
  errorAddresses$ = this.store.pipe(select(getAddressesError));
  errorUser$ = this.store.pipe(select(getUserError));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadAddresses());
  }

  createCustomerAddress(address: Address) {
    this.store.dispatch(new CreateCustomerAddress({ address }));
  }

  deleteCustomerAddress(addressId: string) {
    this.store.dispatch(new DeleteCustomerAddress({ addressId }));
  }

  updateUser(user: User) {
    this.store.dispatch(new UpdateUser({ user }));
  }
}
