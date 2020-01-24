import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Checkout Address Component renders the checkout address page. On this page the user can change invoice and shipping address and create a new invoice or shipping address, respectively.
 */
@Component({
  selector: 'ish-checkout-address',
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent {
  @Input() basket: Basket;
  @Input() error: HttpError;

  @Output() nextStep = new EventEmitter<void>();

  submitted = false;
  active: 'invoice' | 'shipping';

  /**
   * leads to next checkout page (checkout shipping)
   */
  goToNextStep() {
    this.submitted = true;
    if (!this.nextDisabled) {
      this.nextStep.emit();
    }
  }

  get nextDisabled() {
    return this.basket && (!this.basket.invoiceToAddress || !this.basket.commonShipToAddress) && this.submitted;
  }

  invoiceCollapsed(value: boolean) {
    if (!value) {
      this.active = 'invoice';
    }
  }

  shippingCollapsed(value: boolean) {
    if (!value) {
      this.active = 'shipping';
    }
  }
}
