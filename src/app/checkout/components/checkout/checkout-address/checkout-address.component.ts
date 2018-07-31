import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Address } from '../../../../models/address/address.model';
import { Basket } from '../../../../models/basket/basket.model';

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

  @Output()
  updateInvoiceAddress = new EventEmitter<string>();
  @Output()
  updateShippingAddress = new EventEmitter<string>();

  invoiceAddresses: Address[] = [];
  invoiceAddressForm: FormGroup;
  emptyInvoiceAddressOptionLabel: string;

  shippingAddresses: Address[] = [];
  shippingAddressForm: FormGroup;
  emptyShippingAddressOptionLabel: string;

  destroy$ = new Subject();

  constructor(private router: Router) {}

  ngOnInit() {
    // create invoice address form
    this.invoiceAddressForm = new FormGroup({
      id: new FormControl(''),
    });

    // trigger update invoice address if it changes
    this.invoiceAddressForm
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(invoiceAddressId => this.updateInvoiceAddress.emit(invoiceAddressId));

    // create shipping address form
    this.shippingAddressForm = new FormGroup({
      id: new FormControl(''),
    });

    // trigger update shipping address if it changes
    this.shippingAddressForm
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(shippingAddressId => this.updateShippingAddress.emit(shippingAddressId));
  }

  /*
    if basket or addresses changes - update select box options and the empty select text of the select box
  */
  ngOnChanges() {
    // all customer invoice addresses except the address which is currently assigned as invoive address to the basket
    this.invoiceAddresses = this.addresses.filter(
      (address: Address) =>
        ((this.basket.invoiceToAddress && address.id !== this.basket.invoiceToAddress.id) ||
          !this.basket.invoiceToAddress) &&
        address.invoiceToAddress
    );
    this.emptyInvoiceAddressOptionLabel = this.basket.invoiceToAddress
      ? 'checkout.addresses.select_a_different_address.default'
      : 'checkout.addresses.select_invoice_address.button';

    // all customer shipping addresses except the address which is currently assigned as shipping address to the basket
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
