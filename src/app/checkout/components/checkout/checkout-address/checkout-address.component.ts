import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../../../models/address/address.model';
import { Basket } from '../../../../models/basket/basket.model';
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'ish-checkout-address',
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent implements OnInit, OnChanges {
  @Input() basket: Basket;
  @Input() user: User;
  @Input() addresses: Address[];

  invoiceAddresses: Address[] = [];
  invoiceAddressForm: FormGroup;
  emptyInvoiceAddressOptionLabel: string;

  shippingAddresses: Address[] = [];
  shippingAddressForm: FormGroup;
  emptyShippingAddressOptionLabel: string;

  ngOnInit() {
    this.invoiceAddressForm = new FormGroup({
      id: new FormControl('', Validators.required),
    });

    this.shippingAddressForm = new FormGroup({
      id: new FormControl('', Validators.required),
    });
  }

  /*
    if basket or addresses changes - update select box options and the empty select text of the select box
  */
  ngOnChanges() {
    this.invoiceAddresses = this.addresses.filter(
      (address: Address) =>
        ((this.basket.invoiceToAddress && address.id !== this.basket.invoiceToAddress.id) ||
          !this.basket.invoiceToAddress) &&
        address.invoiceToAddress
    );
    this.emptyInvoiceAddressOptionLabel = this.basket.invoiceToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_invoice_address.button';

    this.shippingAddresses = this.addresses.filter(
      (address: Address) =>
        ((this.basket.commonShipToAddress && address.id !== this.basket.commonShipToAddress.id) ||
          !this.basket.commonShipToAddress) &&
        address.shipToAddress
    );
    this.emptyShippingAddressOptionLabel = this.basket.commonShipToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_shipping_address.button';
  }
}
