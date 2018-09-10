import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Address } from '../../../../models/address/address.model';
import { Basket } from '../../../../models/basket/basket.model';
import { Country } from '../../../../models/country/country.model';
import { HttpError } from '../../../../models/http-error/http-error.model';
import { Region } from '../../../../models/region/region.model';

/**
 * The Checkout Address Component renders the checkout address page. On this page the user can change invoice and shipping address and create a new invoice or shipping address, respectively. See also {@link CheckoutAddressPageContainerComponent}
 *
 * @example
 *<ish-checkout-address
    [basket]="basket$ | async"
    [addresses]="addresses$ | async"
    [error]="basketError$ | async"
    [countries]="countries$ | async"
    [regions]="regionsForSelectedCountry$ | async"
    [titles]="titlesForSelectedCountry$ | async"
    (updateInvoiceAddress)="updateBasketInvoiceAddress($event)"
    (updateShippingAddress)="updateBasketShippingAddress($event)"
    (createInvoiceAddress)="createCustomerInvoiceAddress($event)"
    (createShippingAddress)="createCustomerShippingAddress($event)"
    (countryChange)="updateDataAfterCountryChange($event)"
  ></ish-checkout-address>
 */
@Component({
  selector: 'ish-checkout-address',
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  basket: Basket;
  @Input()
  addresses: Address[];
  @Input()
  error: HttpError;
  @Input()
  countries: Country[];
  @Input()
  regions: Region[];
  @Input()
  titles: string[];

  @Output()
  updateInvoiceAddress = new EventEmitter<string>();
  @Output()
  updateShippingAddress = new EventEmitter<string>();
  @Output()
  createInvoiceAddress = new EventEmitter<Address>();
  @Output()
  createShippingAddress = new EventEmitter<Address>();
  @Output()
  countryChange = new EventEmitter<string>();

  invoiceAddresses: Address[] = [];
  invoiceAddressForm: FormGroup;
  emptyInvoiceAddressOptionLabel: string;
  isInvoiceAddressFormCollapsed = true;
  resetInvoiceAddressForm = false;

  shippingAddresses: Address[] = [];
  shippingAddressForm: FormGroup;
  emptyShippingAddressOptionLabel: string;
  isShippingAddressFormCollapsed = true;
  resetShippingAddressForm = false;

  destroy$ = new Subject();

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    // create invoice address form (selectbox)
    this.invoiceAddressForm = new FormGroup({
      id: new FormControl(''),
    });

    // trigger set basket invoice address if it changes
    this.invoiceAddressForm
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(invoiceAddressId => this.updateInvoiceAddress.emit(invoiceAddressId));

    // create shipping address form (selectbox)
    this.shippingAddressForm = new FormGroup({
      id: new FormControl(''),
    });

    // trigger set basket shipping address if it changes
    this.shippingAddressForm
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(shippingAddressId => this.updateShippingAddress.emit(shippingAddressId));
  }

  /*
    if basket or addresses changes - update select box options and the empty select text of the select box
  */
  ngOnChanges(c: SimpleChanges) {
    if (c.addresses || c.basket) {
      // prepare select box label and content
      this.prepareInvoiceAddressSelectBox();
      this.prepareShippingAddressSelectBox();

      // close possible address forms after address changes
      this.isInvoiceAddressFormCollapsed = true;
      this.isShippingAddressFormCollapsed = true;

      // ToDo: reset address form components
      this.resetInvoiceAddressForm = true;
      this.resetShippingAddressForm = true;
    }
  }

  /**
   * Sets the label of the invoice select box, which depends on whether or not there is already a basket invoice address.
   * Determines addresses of the select box: all invoice addresses are shown except the address which is currently assigned as invoive address to the basket
   */
  prepareInvoiceAddressSelectBox() {
    this.emptyInvoiceAddressOptionLabel = this.basket.invoiceToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_invoice_address.button';

    this.invoiceAddresses = this.addresses.filter(
      (address: Address) =>
        ((this.basket.invoiceToAddress && address.id !== this.basket.invoiceToAddress.id) ||
          !this.basket.invoiceToAddress) &&
        address.invoiceToAddress
    );
  }

  /**
   * Sets the label of the shipping select box, which depends on whether or not there is already a basket shipping address.
   * Determines addresses of the select box: all shipping addresses are shown except the address which is currently assigned as shipping address to the basket
   */
  prepareShippingAddressSelectBox() {
    this.emptyShippingAddressOptionLabel = this.basket.commonShipToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_shipping_address.button';

    this.shippingAddresses = this.addresses.filter(
      (address: Address) =>
        ((this.basket.commonShipToAddress && address.id !== this.basket.commonShipToAddress.id) ||
          !this.basket.commonShipToAddress) &&
        address.shipToAddress
    );
  }

  showInvoiceAddressForm() {
    this.isInvoiceAddressFormCollapsed = false;
    this.isShippingAddressFormCollapsed = true;
  }

  showShippingAddressForm() {
    this.isShippingAddressFormCollapsed = false;
    this.isInvoiceAddressFormCollapsed = true;
  }

  /* functions for reactioning on events of the checkout-address-component */
  createCustomerInvoiceAddress(address: Address) {
    this.resetInvoiceAddressForm = false;
    this.createInvoiceAddress.emit(address);
  }

  cancelCreateCustomerInvoiceAddress() {
    this.isInvoiceAddressFormCollapsed = true;
  }

  createCustomerShippingAddress(address: Address) {
    this.resetShippingAddressForm = false;
    this.createShippingAddress.emit(address);
  }

  cancelCreateCustomerShippingAddress() {
    this.isShippingAddressFormCollapsed = true;
  }

  handleCountryChange(countryCode: string) {
    this.countryChange.emit(countryCode);
  }

  /**
   * leads to next checkout page (checkout shipping)
   */
  nextStep() {
    // ToDo: routing should be handled in another way, see #ISREST-317
    this.router.navigate(['/checkout/shipping']);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
