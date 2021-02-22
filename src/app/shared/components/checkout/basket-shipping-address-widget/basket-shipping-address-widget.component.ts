import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, switchMapTo, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Standalone widget component for selecting and setting the basket shipping address in the checkout.
 */
@Component({
  selector: 'ish-basket-shipping-address-widget',
  templateUrl: './basket-shipping-address-widget.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BasketShippingAddressWidgetComponent implements OnInit, OnDestroy {
  @Input() showErrors = true;

  @Output() collapseChange = new BehaviorSubject(true);

  @Input()
  set collapse(value: boolean) {
    this.collapseChange.next(value);
    if (value) {
      this.editAddress = {};
    }
  }

  shippingAddress$: Observable<Address>;
  emptyOptionLabel$: Observable<string>;
  addresses$: Observable<Address[]>;
  basketInvoiceAndShippingAddressEqual$: Observable<boolean>;
  basketShippingAddressDeletable$: Observable<boolean>;

  form: FormGroup;
  editAddress: Partial<Address>;

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {
    this.form = new FormGroup({
      id: new FormControl(''),
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

    // prepare data for shipping select drop down
    this.addresses$ = combineLatest([this.accountFacade.addresses$(), this.shippingAddress$]).pipe(
      map(
        ([addresses, shippingAddress]) =>
          addresses &&
          addresses
            .filter(address => address.shipToAddress)
            .filter(address => address.id !== (shippingAddress && shippingAddress.id))
      )
    );

    // preassign a shipping address if the user has only one shipping address
    this.checkoutFacade.basket$
      .pipe(
        whenTruthy(),
        // prevent assigning the address at an anonymous basket after login
        filter(basket => !!basket.customerNo),
        take(1),
        switchMapTo(
          combineLatest([this.addresses$, this.shippingAddress$]).pipe(
            filter(([addresses]) => addresses && !!addresses.length),
            take(1)
          )
        ),
        takeUntil(this.destroy$)
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
    if (address) {
      this.editAddress = { ...address };
    } else {
      this.editAddress = {};
    }
    this.collapse = false;
  }

  saveAddress(address: Address) {
    if (this.editAddress && Object.keys(this.editAddress).length > 0) {
      this.checkoutFacade.updateBasketAddress(address);
      this.collapse = true;
    } else {
      this.checkoutFacade.createBasketAddress(address, 'shipping');
      (this.form.get('id') as FormControl).setValue('', { emitEvent: false });
    }
  }

  cancelEditAddress() {
    this.collapse = true;
  }

  deleteAddress(address: Address) {
    this.checkoutFacade.deleteBasketAddress(address.id);
  }
}
