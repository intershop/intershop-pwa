import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';

/**
 * Standalone widget component for selecting and setting the basket invoice address in the checkout.
 */
@Component({
  selector: 'ish-basket-invoice-address-widget',
  templateUrl: './basket-invoice-address-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketInvoiceAddressWidgetComponent implements OnInit, OnDestroy {
  @Input() showErrors = true;

  @Output() collapseChange = new BehaviorSubject(true);

  @Input()
  set collapse(value: boolean) {
    this.collapseChange.next(value);
  }

  invoiceAddress$: Observable<Address>;
  emptyOptionLabel$: Observable<string>;
  addresses$: Observable<Address[]>;

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
    this.invoiceAddress$ = this.checkoutFacade.basketInvoiceAddress$;

    this.emptyOptionLabel$ = this.invoiceAddress$.pipe(
      map(address =>
        address
          ? 'checkout.addresses.select_a_different_address.default'
          : 'checkout.addresses.select_invoice_address.button'
      )
    );
    this.addresses$ = combineLatest([this.accountFacade.addresses$(), this.invoiceAddress$]).pipe(
      map(
        ([addresses, invoiceAddress]) =>
          addresses &&
          addresses
            .filter(address => address.invoiceToAddress)
            .filter(address => address.id !== (invoiceAddress && invoiceAddress.id))
      )
    );

    combineLatest([this.addresses$, this.invoiceAddress$])
      .pipe(
        filter(([addresses]) => addresses && !!addresses.length),
        take(1)
      )
      .subscribe(([addresses, invoiceAddress]) => {
        if (!invoiceAddress && addresses.length === 1) {
          this.checkoutFacade.assignBasketAddress(addresses[0].id, 'invoice');
        }
      });

    this.form
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(invoiceAddressId => this.checkoutFacade.assignBasketAddress(invoiceAddressId, 'invoice'));

    this.invoiceAddress$.pipe(takeUntil(this.destroy$)).subscribe(() => (this.collapse = true));
  }

  showAddressForm(address?: Address) {
    this.editAddress = address;
    this.collapse = false;
  }

  saveAddress(address: Address) {
    if (this.editAddress) {
      this.checkoutFacade.updateBasketAddress(address);
    } else {
      this.checkoutFacade.createBasketAddress(address, 'invoice');
      (this.form.get('id') as FormControl).setValue('', { emitEvent: false });
    }
  }

  cancelEditAddress() {
    this.collapse = true;
    this.editAddress = undefined;
  }
}
