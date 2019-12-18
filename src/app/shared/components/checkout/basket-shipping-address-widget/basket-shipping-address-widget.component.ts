import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';

/**
 * Standalone widget component for selecting and setting the basket shipping address in the checkout.
 */
@Component({
  selector: 'ish-basket-shipping-address-widget',
  templateUrl: './basket-shipping-address-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketShippingAddressWidgetComponent implements OnInit, OnDestroy {
  @Input() showErrors = true;

  @Output() collapseChange = new BehaviorSubject(true);

  @Input()
  set collapse(value: boolean) {
    this.collapseChange.next(value);
  }

  shippingAddress$: Observable<Address>;
  emptyOptionLabel$: Observable<string>;
  addresses$: Observable<Address[]>;
  basketInvoiceAndShippingAddressEqual$: Observable<boolean>;
  basketShippingAddressDeletable$: Observable<boolean>;

  form: FormGroup;
  editAddress: Address;

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {
    this.form = new FormGroup({
      id: new FormControl(''),
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngOnInit() {
    this.shippingAddress$ = this.checkoutFacade.basketShippingAddress$;
    this.basketInvoiceAndShippingAddressEqual$ = this.checkoutFacade.basketInvoiceAndShippingAddressEqual$;
    this.basketShippingAddressDeletable$ = this.checkoutFacade.basketShippingAddressDeletable$;

    this.emptyOptionLabel$ = this.shippingAddress$.pipe(
      map(address =>
        address
          ? 'checkout.addresses.select_a_different_address.default'
          : 'checkout.addresses.select_shipping_address.button'
      )
    );
    this.addresses$ = combineLatest([this.accountFacade.addresses$(), this.shippingAddress$]).pipe(
      map(
        ([addresses, shippingAddress]) =>
          addresses &&
          addresses
            .filter(address => address.shipToAddress)
            .filter(address => address.id !== (shippingAddress && shippingAddress.id))
      )
    );

    combineLatest([this.addresses$, this.shippingAddress$])
      .pipe(
        filter(([addresses]) => addresses && !!addresses.length),
        take(1)
      )
      .subscribe(([addresses, shippingAddress]) => {
        if (!shippingAddress && addresses.length === 1) {
          this.checkoutFacade.assignBasketAddress(addresses[0].id, 'shipping');
        }
      });

    this.form
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(shippingAddressId => this.checkoutFacade.assignBasketAddress(shippingAddressId, 'shipping'));

    this.shippingAddress$.pipe(takeUntil(this.destroy$)).subscribe(() => (this.collapse = true));
  }

  showAddressForm(address?: Address) {
    this.editAddress = address;
    this.collapse = false;
  }

  saveAddress(address: Address) {
    if (this.editAddress) {
      this.checkoutFacade.updateBasketAddress(address);
    } else {
      this.checkoutFacade.createBasketAddress(address, 'shipping');
      (this.form.get('id') as FormControl).setValue('', { emitEvent: false });
    }
  }

  cancelEditAddress() {
    this.collapse = true;
    this.editAddress = undefined;
  }

  deleteAddress(address: Address) {
    this.checkoutFacade.deleteBasketAddress(address.id);
  }
}
