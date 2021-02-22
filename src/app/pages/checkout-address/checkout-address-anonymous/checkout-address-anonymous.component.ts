import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Checkout Address Anonymous Component renders the initial checkout address page of an anonymous user. On this page the user can either login or checkout as guest by entering an invoice and (optionally) shipping address.
 * See also {@link CheckoutAddressPageContainerComponent}
 *
 * @example
 * <ish-checkout-address-anonymous
 *  [basket]="basket$ | async"
 *  [error]="(basketError$ | async) || (addressesError$ | async)"
 *  (createBasketAddress)="createBasketAddress($event)"
 * ></ish-checkout-address-anonymous>
 */
@Component({
  selector: 'ish-checkout-address-anonymous',
  templateUrl: './checkout-address-anonymous.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressAnonymousComponent implements OnChanges, OnInit, OnDestroy {
  @Input() basket: Basket;
  @Input() error: HttpError;

  @Output() nextStep = new EventEmitter<void>();

  @ViewChild('addressForm') addressForm: FormGroupDirective;

  form: FormGroup;
  invoiceAddressForm: FormGroup;
  shippingAddressForm: FormGroup;

  submitted = false;
  isAddressFormCollapsed = true;

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade, private fb: FormBuilder) {}

  ngOnInit() {
    // create address form for basket addresses
    this.form = this.fb.group({
      taxationID: [''],
      email: ['', [Validators.required, SpecialValidators.email]],
      shipOption: ['shipToInvoiceAddress', [Validators.required]],
    });
    this.invoiceAddressForm = this.fb.group({
      address: new FormGroup({}),
    });
    this.shippingAddressForm = this.fb.group({
      address: new FormGroup({}),
    });
    this.form.addControl('invoiceAddress', this.invoiceAddressForm);

    // add / remove shipping form if shipTo address option changes
    this.form
      .get('shipOption')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(option => {
        option === 'shipToInvoiceAddress'
          ? this.form.removeControl('shippingAddress')
          : this.form.addControl('shippingAddress', this.shippingAddressForm);
      });
  }

  /**
    jumps to nextPage as soon as basket invoice and shipping addresses are set.
  */
  ngOnChanges() {
    if (this.isNextStepAvailable()) {
      this.nextStep.emit();
    }
  }

  /**
   * checks, if all data are available to jump to the next checkout step
   */
  isNextStepAvailable() {
    return this.basket && this.basket.invoiceToAddress && this.basket.commonShipToAddress;
  }

  showAddressForm() {
    this.isAddressFormCollapsed = false;
    // do not close address form immediately to show possible server errors
  }

  cancelAddressForm() {
    this.isAddressFormCollapsed = true;
    this.addressForm.resetForm();
    this.form.controls.shipOption.setValue('shipToInvoiceAddress');
    this.submitted = false;
  }

  /**
   * submits address form and leads to next checkout page (checkout shipping)
   */
  submitAddressForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    // submit address form
    const invoiceAddress = { ...this.invoiceAddressForm.get('address').value, email: this.form.controls.email.value };

    const shippingAddress =
      this.form.controls.shipOption.value === 'shipToInvoiceAddress'
        ? undefined
        : this.shippingAddressForm.get('address').value;

    if (this.form.get('taxationID').value) {
      this.checkoutFacade.setBasketCustomAttribute({ name: 'taxationID', value: this.form.get('taxationID').value });
    } else {
      this.checkoutFacade.deleteBasketCustomAttribute('taxationID');
    }

    if (shippingAddress) {
      this.checkoutFacade.createBasketAddress(invoiceAddress, 'invoice');
      this.checkoutFacade.createBasketAddress(shippingAddress, 'shipping');
    } else {
      this.checkoutFacade.createBasketAddress(invoiceAddress, 'any');
    }
  }

  get nextDisabled() {
    return this.form.invalid && this.submitted;
  }

  get isShippingAddressFormExpanded() {
    return this.form && this.form.get('shipOption').value === 'shipToDifferentAddress';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
