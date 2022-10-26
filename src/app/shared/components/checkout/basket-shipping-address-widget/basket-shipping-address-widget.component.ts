import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core/lib/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, shareReplay, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { FormsService } from 'ish-shared/forms/utils/forms.service';

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
  addresses$: Observable<Address[]>;
  customerAddresses$: Observable<Address[]>;
  displayAddAddressLink$: Observable<boolean>;

  basketInvoiceAndShippingAddressEqual$: Observable<boolean>;
  basketShippingAddressDeletable$: Observable<boolean>;

  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];
  editAddress: Partial<Address>;
  emptyOptionLabel = 'checkout.addresses.select_shipping_address.button';

  private destroy$ = new Subject<void>();

  constructor(private accountFacade: AccountFacade, private checkoutFacade: CheckoutFacade) {
    this.form = new UntypedFormGroup({
      id: new UntypedFormControl(''),
    });
  }

  ngOnInit() {
    this.customerAddresses$ = this.accountFacade.addresses$().pipe(shareReplay(1));
    this.shippingAddress$ = this.checkoutFacade.basketShippingAddress$;
    this.basketInvoiceAndShippingAddressEqual$ = this.checkoutFacade.basketInvoiceAndShippingAddressEqual$;
    this.basketShippingAddressDeletable$ = this.checkoutFacade.basketShippingAddressDeletable$;

    this.shippingAddress$
      .pipe(
        map(address =>
          address
            ? 'checkout.addresses.select_a_different_address.default'
            : 'checkout.addresses.select_shipping_address.button'
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(label => (this.emptyOptionLabel = label));

    // prepare data for shipping select drop down
    this.addresses$ = combineLatest([this.customerAddresses$, this.shippingAddress$]).pipe(
      map(([addresses, shippingAddress]) =>
        addresses?.filter(address => address.shipToAddress).filter(address => address.id !== shippingAddress?.id)
      )
    );

    this.displayAddAddressLink$ = combineLatest([
      this.collapseChange,
      this.accountFacade.isLoggedIn$,
      this.basketInvoiceAndShippingAddressEqual$,
    ]).pipe(map(([collapseChange, loggedIn, addressesEqual]) => collapseChange && (loggedIn || addressesEqual)));

    this.fields = [
      {
        key: 'id',
        type: 'ish-select-field',
        templateOptions: {
          fieldClass: 'col-12',
          options: FormsService.getAddressOptions(this.addresses$),
          placeholder: this.emptyOptionLabel,
        },
        hooks: {
          onInit: field => {
            field.form
              .get('id')
              .valueChanges.pipe(whenTruthy(), takeUntil(this.destroy$))
              .subscribe(addressId => this.checkoutFacade.assignBasketAddress(addressId, 'shipping'));
          },
        },
      },
    ];

    // preassign a shipping address if the user has only one shipping address
    combineLatest([this.addresses$, this.checkoutFacade.basket$])
      .pipe(
        // prevent assigning the address at an anonymous basket after login
        filter(([addresses, basket]) => !!basket?.customerNo && !!addresses?.length),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(([addresses, basket]) => {
        if (!basket.commonShipToAddress && addresses.length === 1) {
          this.checkoutFacade.assignBasketAddress(addresses[0].id, 'shipping');
        }
      });

    this.shippingAddress$.pipe(takeUntil(this.destroy$)).subscribe(() => (this.collapse = true));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      (this.form.get('id') as UntypedFormControl).setValue('', { emitEvent: false });
    }
  }

  cancelEditAddress() {
    this.collapse = true;
  }

  deleteAddress(address: Address) {
    this.checkoutFacade.deleteBasketAddress(address.id);
  }
}
