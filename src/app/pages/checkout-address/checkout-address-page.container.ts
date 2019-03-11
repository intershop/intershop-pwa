import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { getAddressesError, getAddressesLoading, getAllAddresses } from 'ish-core/store/checkout/addresses';
import { LoadAddresses } from 'ish-core/store/checkout/addresses/addresses.actions';
import {
  CreateBasketAddress,
  DeleteBasketShippingAddress,
  UpdateBasketCustomerAddress,
  UpdateBasketInvoiceAddress,
  UpdateBasketShippingAddress,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from 'ish-core/store/checkout/basket';
import { getLoggedInUser } from 'ish-core/store/user';

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
  currentUser$ = this.store.pipe(select(getLoggedInUser));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.currentUser$
      .pipe(
        filter(x => !!x),
        take(1)
      )
      .subscribe(() => this.store.dispatch(new LoadAddresses()));
  }

  updateBasketInvoiceAddress(addressId: string) {
    this.store.dispatch(new UpdateBasketInvoiceAddress({ addressId }));
  }

  updateBasketShippingAddress(addressId: string) {
    this.store.dispatch(new UpdateBasketShippingAddress({ addressId }));
  }

  updateBasketCustomerAddress(address: Address) {
    this.store.dispatch(new UpdateBasketCustomerAddress({ address }));
  }

  createCustomerInvoiceAddress(address: Address) {
    this.store.dispatch(new CreateBasketAddress({ address, scope: 'invoice' }));
  }

  createCustomerShippingAddress(address: Address) {
    this.store.dispatch(new CreateBasketAddress({ address, scope: 'shipping' }));
  }

  /**
   * create a basket address and assign it to basket
   */
  createBasketAddress(body: { address: Address; scope: 'invoice' | 'shipping' | 'any' }) {
    if (!body || !body.address || !body.scope) {
      return;
    }

    this.store.dispatch(new CreateBasketAddress({ address: body.address, scope: body.scope }));
  }

  deleteCustomerAddress(addressId: string) {
    this.store.dispatch(new DeleteBasketShippingAddress({ addressId }));
  }
}
