import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { LoadAddresses, getAddressesError, getAddressesLoading, getAllAddresses } from 'ish-core/store/addresses';
import {
  AssignBasketAddress,
  ContinueCheckout,
  CreateBasketAddress,
  DeleteBasketShippingAddress,
  UpdateBasketAddress,
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

  // initial basket's valid addresses in order to decide which address component should be displayed
  validBasketAddresses = false;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    // load customer addresses from server if user is logged in
    this.currentUser$
      .pipe(
        filter(x => !!x),
        take(1)
      )
      .subscribe(() => this.store.dispatch(new LoadAddresses()));

    // determine if basket addresses are available at page start
    this.basket$
      .pipe(
        filter(x => !!x),
        take(1)
      )
      .subscribe(basket => (this.validBasketAddresses = !!basket.invoiceToAddress && !!basket.commonShipToAddress));
  }

  /**
   * Assigns another address as basket invoice and/or shipping address
   */
  assignAddressToBasket(body: { addressId: string; scope: 'invoice' | 'shipping' | 'any' }) {
    this.store.dispatch(new AssignBasketAddress({ addressId: body.addressId, scope: body.scope }));
  }

  /**
   * creates address and assigns it to basket
   */
  createAddress(body: { address: Address; scope: 'invoice' | 'shipping' | 'any' }) {
    if (!body || !body.address || !body.scope) {
      return;
    }

    this.store.dispatch(new CreateBasketAddress({ address: body.address, scope: body.scope }));
  }

  /**
   * Updates an address which is assigned to basket
   */
  updateAddress(address: Address) {
    this.store.dispatch(new UpdateBasketAddress({ address }));
  }

  /**
   * Deletes a customer address which is assigned to basket
   */
  deleteCustomerAddress(addressId: string) {
    this.store.dispatch(new DeleteBasketShippingAddress({ addressId }));
  }

  /**
   * Validates the basket and jumps to the next checkout step (Shipping)
   */
  nextStep() {
    this.store.dispatch(new ContinueCheckout({ targetStep: 2 }));
  }
}
