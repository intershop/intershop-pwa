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
import { User } from '../../../../models/user/user.model';

class FormType {
  addresses: Address[]; // address select options
  form: FormGroup;
  emptyOptionLabel: string; // select box label
  isFormCollapsed = true;
  address: Address;
  isAddressDeleteable: boolean;
}

/**
 * The Checkout Address Component renders the checkout address page. On this page the user can change invoice and shipping address and create a new invoice or shipping address, respectively. See also {@link CheckoutAddressPageContainerComponent}
 *
 * @example
 *<ish-checkout-address
    [currentUser]="currentUser$ | async"
    [basket]="basket$ | async"
    [addresses]="addresses$ | async"
    [error]="basketError$ | async"
    [countries]="countries$ | async"
    [regions]="regionsForSelectedCountry$ | async"
    [titles]="titlesForSelectedCountry$ | async"
    (updateInvoiceAddress)="updateBasketInvoiceAddress($event)"
    (updateShippingAddress)="updateBasketShippingAddress($event)"
    (updateCustomerAddress)="updateBasketCustomerAddress($event)"
    (createInvoiceAddress)="createCustomerInvoiceAddress($event)"
    (createShippingAddress)="createCustomerShippingAddress($event)"
    (deleteShippingAddress)="deleteCustomerAddress($event)"
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
  currentUser: User;
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
  updateCustomerAddress = new EventEmitter<Address>();
  @Output()
  createInvoiceAddress = new EventEmitter<Address>();
  @Output()
  createShippingAddress = new EventEmitter<Address>();
  @Output()
  deleteShippingAddress = new EventEmitter<string>();
  @Output()
  countryChange = new EventEmitter<string>();

  invoice = new FormType();
  shipping = new FormType();

  destroy$ = new Subject();

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    // create invoice address form (selectbox)
    this.invoice.form = new FormGroup({
      id: new FormControl(''),
    });

    // trigger set basket invoice address if it changes
    this.invoice.form
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(invoiceAddressId => this.updateInvoiceAddress.emit(invoiceAddressId));

    // create shipping address form (selectbox)
    this.shipping.form = new FormGroup({
      id: new FormControl(''),
    });

    // trigger set basket shipping address if it changes
    this.shipping.form
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(shippingAddressId => this.updateShippingAddress.emit(shippingAddressId));
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.addresses || c.basket) {
      // prepare select box label and content
      this.prepareInvoiceAddressSelectBox();
      this.prepareShippingAddressSelectBox();

      // close possible address forms after address changes
      this.invoice.isFormCollapsed = true;
      this.shipping.isFormCollapsed = true;

      // determine whether the shipping address is deleteable
      this.shipping.isAddressDeleteable =
        this.basket.commonShipToAddress &&
        this.currentUser &&
        (!this.currentUser.preferredInvoiceToAddress ||
          this.basket.commonShipToAddress.id !== this.currentUser.preferredInvoiceToAddress.id) &&
        (!this.currentUser.preferredShipToAddress ||
          this.basket.commonShipToAddress.id !== this.currentUser.preferredShipToAddress.id);
    }
  }

  /**
   * Sets the label of the invoice select box, which depends on whether or not there is already a basket invoice address.
   * Determines addresses of the select box: all invoice addresses are shown except the address which is currently assigned as invoive address to the basket
   */
  prepareInvoiceAddressSelectBox() {
    this.invoice.emptyOptionLabel = this.basket.invoiceToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_invoice_address.button';

    this.invoice.addresses = this.addresses.filter(
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
    this.shipping.emptyOptionLabel = this.basket.commonShipToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_shipping_address.button';

    this.shipping.addresses = this.addresses.filter(
      (address: Address) =>
        ((this.basket.commonShipToAddress && address.id !== this.basket.commonShipToAddress.id) ||
          !this.basket.commonShipToAddress) &&
        address.shipToAddress
    );
  }

  showInvoiceAddressForm(address?: Address) {
    this.invoice.isFormCollapsed = false;
    this.cancelEditAddress(this.shipping);
    this.invoice.address = address ? address : undefined;
  }

  showShippingAddressForm(address?: Address) {
    this.shipping.isFormCollapsed = false;
    this.cancelEditAddress(this.invoice);
    this.shipping.address = address ? address : undefined;
  }

  /* functions for reactioning on events of the checkout-address-component */
  saveCustomerInvoiceAddress(address: Address) {
    if (this.invoice.address) {
      this.updateCustomerAddress.emit(address);
    } else {
      this.createInvoiceAddress.emit(address);
    }
  }

  saveCustomerShippingAddress(address: Address) {
    if (this.shipping.address) {
      this.updateCustomerAddress.emit(address);
    } else {
      this.createShippingAddress.emit(address);
    }
  }

  cancelEditAddress(formType: FormType) {
    formType.isFormCollapsed = true;
    formType.address = undefined;
  }

  deleteAddress(address: Address) {
    this.deleteShippingAddress.emit(address.id);
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
