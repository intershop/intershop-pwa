import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, switchMapTo, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { whenTruthy } from 'ish-core/utils/operators';

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
  emptyOptionLabel$: Observable<string>;
  addresses$: Observable<Address[]>;

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
    this.invoiceAddress$ = this.checkoutFacade.basketInvoiceAddress$;

    this.emptyOptionLabel$ = this.invoiceAddress$.pipe(
      map(address =>
        address
          ? 'checkout.addresses.select_a_different_address.default'
          : 'checkout.addresses.select_invoice_address.button'
      )
    );

    // prepare data for invoice select drop down
    this.addresses$ = combineLatest([this.accountFacade.addresses$(), this.invoiceAddress$]).pipe(
      map(
        ([addresses, invoiceAddress]) =>
          addresses &&
          addresses
            .filter(address => address.invoiceToAddress)
            .filter(address => address.id !== (invoiceAddress && invoiceAddress.id))
      )
    );

    // preassign an invoice address if the user has only one invoice address
    this.checkoutFacade.basket$
      .pipe(
        whenTruthy(),
        // prevent assigning the address at an anonymous basket after login
        filter(basket => !!basket.customerNo),
        take(1),
        switchMapTo(
          combineLatest([this.addresses$, this.invoiceAddress$]).pipe(
            filter(([addresses]) => addresses && !!addresses.length),
            take(1)
          )
        ),
        takeUntil(this.destroy$)
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
      (this.form.get('id') as FormControl).setValue('', { emitEvent: false });
    }
  }

  cancelEditAddress() {
    this.collapse = true;
  }
}
