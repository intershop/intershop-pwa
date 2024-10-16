import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, UntypedFormGroup } from '@angular/forms';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { FormsService } from 'ish-shared/forms/utils/forms.service';

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

  invoiceFormId = 'checkout_invoice_address_form';
  shippingFormId = 'checkout_shipping_address_form';

  // visible-for-testing
  submitted = false;
  isAddressFormCollapsed = true;

  constructor(private checkoutFacade: CheckoutFacade, private formsService: FormsService) {}
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
      this.scrollToFirstInvalidField();
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

  /**
   * When selecting the option to ship to a different address, the newly generated form fields have the
   * same keys as the invoice address form fields. This function differentiates between the shipping and the
   * invoice form and checks in which form an error occurred.
   * This is necessary because if an error in the second form occurs, focusFirstInvalidFieldRecursive() would
   * focus the field with the same key in the first form.
   *
   * TODO: This function is a workaround and the form should be fixed to have unique keys.
   */
  scrollToFirstInvalidField() {
    if (this.form.controls.invoiceAddress?.invalid) {
      this.formsService.focusFirstInvalidFieldRecursive(
        this.form.controls.invoiceAddress as FormGroup,
        this.invoiceFormId
      );
      return;
    }
    if (this.form.controls.shippingAddress?.invalid) {
      this.formsService.focusFirstInvalidFieldRecursive(
        this.form.controls.shippingAddress as FormGroup,
        this.shippingFormId
      );
      return;
    }
    // check possible other fields outside the invoice and shipping forms
    this.formsService.focusFirstInvalidFieldRecursive(this.form);
  }

  get nextDisabled() {
    return this.form.invalid && this.submitted;
  }

  get isShippingAddressFormExpanded() {
    return this.form && this.form.get('shipOptions').value.shipOption === 'shipToDifferentAddress';
  }
}
