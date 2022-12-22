import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, shareReplay, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { FormsService } from 'ish-shared/forms/utils/forms.service';

/**
 * Standalone widget component for selecting and setting the basket invoice address in the checkout.
 */
@Component({
  selector: 'ish-basket-invoice-address-widget',
  templateUrl: './basket-invoice-address-widget.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BasketInvoiceAddressWidgetComponent implements OnInit, OnDestroy {
  @Input() showErrors = true;

  @Output() collapseChange = new BehaviorSubject(true);

  @Input()
  set collapse(value: boolean) {
    this.collapseChange.next(value);
    if (value) {
      this.editAddress = {};
    }
  }
  invoiceAddress$: Observable<Address>;
  addresses$: Observable<Address[]>;
  customerAddresses$: Observable<Address[]>;
  isLoggedIn$: Observable<boolean>;

  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];
  editAddress: Partial<Address>;
  emptyOptionLabel = 'checkout.addresses.select_invoice_address.button';

  private destroy$ = new Subject<void>();

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.customerAddresses$ = this.accountFacade.addresses$().pipe(shareReplay(1));
    this.invoiceAddress$ = this.checkoutFacade.basketInvoiceAddress$;

    this.invoiceAddress$
      .pipe(
        map(address =>
          address
            ? 'checkout.addresses.select_a_different_address.default'
            : 'checkout.addresses.select_invoice_address.button'
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(label => (this.emptyOptionLabel = label));

    // prepare data for invoice select drop down
    this.addresses$ = combineLatest([this.customerAddresses$, this.invoiceAddress$]).pipe(
      map(([addresses, invoiceAddress]) =>
        addresses?.filter(address => address.invoiceToAddress).filter(address => address.id !== invoiceAddress?.id)
      )
    );
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;

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
              .subscribe(addressId => this.checkoutFacade.assignBasketAddress(addressId, 'invoice'));
          },
        },
      },
    ];

    // preassign an invoice address if the user has only one invoice address
    combineLatest([this.addresses$, this.checkoutFacade.basket$])
      .pipe(
        // prevent assigning the address at an anonymous basket after login
        filter(([addresses, basket]) => !!basket?.customerNo && !!addresses?.length),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(([addresses, basket]) => {
        if (!basket.invoiceToAddress && addresses.length === 1) {
          this.checkoutFacade.assignBasketAddress(addresses[0].id, 'invoice');
        }
      });

    this.invoiceAddress$.pipe(takeUntil(this.destroy$)).subscribe(() => (this.collapse = true));
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
      this.checkoutFacade.createBasketAddress(address, 'invoice');
      (this.form.get('id') as UntypedFormControl).setValue('', { emitEvent: false });
    }
  }

  cancelEditAddress() {
    this.collapse = true;
  }
}
