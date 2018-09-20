import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RegionService } from '../../../core/services/countries/region.service';
import { getAllCountries } from '../../../core/store/countries';
import { getLoggedInUser } from '../../../core/store/user';
import { determineSalutations } from '../../../forms/shared/utils/form-utils';
import { Address } from '../../../models/address/address.model';
import { Region } from '../../../models/region/region.model';
import { getAddressesError, getAddressesLoading, getAllAddresses } from '../../store/addresses';
import { LoadAddresses } from '../../store/addresses/addresses.actions';
import {
  CreateBasketInvoiceAddress,
  CreateBasketShippingAddress,
  DeleteBasketShippingAddress,
  UpdateBasketInvoiceAddress,
  UpdateBasketShippingAddress,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from '../../store/basket';

/**
 * The Checkout Address Page Container Component renders the checkout address page of a logged in user using the {@link CheckoutAddressComponent}
 *
 */
@Component({
  selector: 'ish-checkout-address-page-container',
  templateUrl: './checkout-address-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressPageContainerComponent implements OnInit {
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketError$ = this.store.pipe(select(getBasketError));
  basketLoading$ = this.store.pipe(select(getBasketLoading));
  addresses$ = this.store.pipe(select(getAllAddresses));
  addressesError$ = this.store.pipe(select(getAddressesError));
  addressesLoading$ = this.store.pipe(select(getAddressesLoading));
  countries$ = this.store.pipe(select(getAllCountries));
  currentUser$ = this.store.pipe(select(getLoggedInUser));

  regionsForSelectedCountry$: Observable<Region[]>;
  titlesForSelectedCountry$: Observable<string[]>;

  constructor(private store: Store<{}>, private rs: RegionService) {}

  ngOnInit() {
    this.store.dispatch(new LoadAddresses());
  }

  updateDataAfterCountryChange(countryCode: string) {
    this.regionsForSelectedCountry$ = this.rs.getRegions(countryCode);
    this.titlesForSelectedCountry$ = determineSalutations(countryCode);
  }

  updateBasketInvoiceAddress(addressId: string) {
    this.store.dispatch(new UpdateBasketInvoiceAddress(addressId));
  }

  updateBasketShippingAddress(addressId: string) {
    this.store.dispatch(new UpdateBasketShippingAddress(addressId));
  }

  createCustomerInvoiceAddress(address: Address) {
    this.store.dispatch(new CreateBasketInvoiceAddress(address));
  }

  createCustomerShippingAddress(address: Address) {
    this.store.dispatch(new CreateBasketShippingAddress(address));
  }

  deleteCustomerAddress(addressId: string) {
    this.store.dispatch(new DeleteBasketShippingAddress(addressId));
  }
}
