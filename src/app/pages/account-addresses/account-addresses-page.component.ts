import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Addresses Page Container Component renders the account addresses page of a logged in user using the {@link AccountAddressesPageComponent}
 *
 */
@Component({
  templateUrl: './account-addresses-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAddressesPageComponent implements OnInit {
  addresses$: Observable<Address[]>;
  loading$: Observable<boolean>;
  errorAddresses$: Observable<HttpError>;
  user$: Observable<User>;
  errorUser$: Observable<HttpError>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.addresses$ = this.accountFacade.addresses$();
    this.loading$ = this.accountFacade.addressesLoading$;
    this.errorAddresses$ = this.accountFacade.addressesError$;
    this.user$ = this.accountFacade.user$;
    this.errorUser$ = this.accountFacade.userError$;
  }

  createCustomerAddress(address: Address) {
    this.accountFacade.createCustomerAddress(address);
  }

  deleteCustomerAddress(addressId: string) {
    this.accountFacade.deleteCustomerAddress(addressId);
  }
}
