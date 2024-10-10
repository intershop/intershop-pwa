import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup } from '@angular/forms';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

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
export class CheckoutAddressAnonymousComponent implements OnChanges {
  @Input({ required: true }) basket: Basket;
  @Input() error: HttpError;

  @Output() nextStep = new EventEmitter<void>();

  @ViewChild('addressForm') addressForm: FormGroupDirective;

  form = new UntypedFormGroup({});

  // visible-for-testing
  submitted = false;
  isAddressFormCollapsed = true;

  constructor(private checkoutFacade: CheckoutFacade) {}
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
  private isNextStepAvailable() {
    return this.basket?.invoiceToAddress && this.basket.commonShipToAddress;
  }

  showAddressForm() {
    this.isAddressFormCollapsed = false;
    // do not close address form immediately to show possible server errors
  }

  cancelAddressForm() {
    this.isAddressFormCollapsed = true;

    this.addressForm.resetForm();

    this.addressForm.control.get('additionalAddressAttributes').setValue({
      taxationID: '',
      email: '',
    });

    this.addressForm.control.get('shipOptions').setValue({
      shipOption: 'shipToInvoiceAddress',
    });

    this.submitted = false;
  }

  /**
   * submits address form and leads to next checkout page (checkout shipping)
   */
  submitAddressForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      focusFirstInvalidField(this.form);
      return;
    }

    // submit address form
    const invoiceAddress = {
      ...this.form.get('invoiceAddress').value.address,
      email: this.form.get('additionalAddressAttributes').value.email,
    };

    const shippingAddress =
      this.form.get('shipOptions').value.shipOption === 'shipToInvoiceAddress'
        ? undefined
        : this.form.get('shippingAddress').value.address;

    if (this.form.get('additionalAddressAttributes').get('taxationID')) {
      if (this.form.get('additionalAddressAttributes').value.taxationID) {
        this.checkoutFacade.setBasketCustomAttribute({
          name: 'taxationID',
          value: this.form.get('additionalAddressAttributes').value.taxationID,
        });
      } else {
        this.checkoutFacade.deleteBasketCustomAttribute('taxationID');
      }
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
    return this.form && this.form.get('shipOptions').value.shipOption === 'shipToDifferentAddress';
  }
}
