import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

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
  basket$: Observable<BasketView>;
  basketError$: Observable<HttpError>;
  basketLoading$: Observable<boolean>;
  addresses$: Observable<Address[]>;
  addressesError$: Observable<HttpError>;
  addressesLoading$: Observable<boolean>;
  currentUser$: Observable<User>;

  // initial basket's valid addresses in order to decide which address component should be displayed
  validBasketAddresses$: Observable<boolean>;

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.addresses$ = this.accountFacade.addresses$();
    this.addressesError$ = this.accountFacade.addressesError$;
    this.addressesLoading$ = this.accountFacade.addressesLoading$;
    this.currentUser$ = this.accountFacade.user$;

    // determine if basket addresses are available at page start
    this.validBasketAddresses$ = this.basket$.pipe(
      map(basket => !!basket && !!basket.invoiceToAddress && !!basket.commonShipToAddress),
      first()
    );
  }

  /**
   * Assigns another address as basket invoice and/or shipping address
   */
  assignAddressToBasket(body: { addressId: string; scope: 'invoice' | 'shipping' | 'any' }) {
    this.checkoutFacade.assignBasketAddress(body);
  }

  /**
   * creates address and assigns it to basket
   */
  createAddress(body: { address: Address; scope: 'invoice' | 'shipping' | 'any' }) {
    this.checkoutFacade.createBasketAddress(body);
  }

  /**
   * Updates an address which is assigned to basket
   */
  updateAddress(address: Address) {
    this.checkoutFacade.updateBasketAddress(address);
  }

  /**
   * Deletes a customer address which is assigned to basket
   */
  deleteCustomerAddress(addressId: string) {
    this.checkoutFacade.deleteBasketAddress(addressId);
  }

  /**
   * Validates the basket and jumps to the next checkout step (Shipping)
   */
  nextStep() {
    this.checkoutFacade.continue(2);
  }
}
