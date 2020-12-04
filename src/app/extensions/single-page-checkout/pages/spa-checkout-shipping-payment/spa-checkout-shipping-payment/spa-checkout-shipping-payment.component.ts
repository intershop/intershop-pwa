import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-spa-checkout-shipping-payment',
  templateUrl: './spa-checkout-shipping-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaCheckoutShippingPaymentComponent {
  @Input() basket: Basket;
  @Input() shippingMethods: ShippingMethod[];
  @Input() error: HttpError;

  @Output() updateShippingMethod = new EventEmitter<{ shippingId; type }>();
  @Output() nextStep = new EventEmitter<{ id: string; parameters: [] }>();

  shippingForm: FormGroup;
  submitted = false;
  isPaymentStatusInvalid = false;
  shipProduct = undefined;

  private destroy$ = new Subject();

  /**
   * leads to next checkout page (checkout payment)
   */
  goToNextStep() {
    if (!this.nextDisabled) {
      this.nextStep.emit();
    }
  }

  get nextDisabled() {
    return (
      !this.basket ||
      !this.shippingMethods ||
      !this.shippingMethods.length ||
      (!this.basket.commonShippingMethod && this.submitted)
    );
  }

  showProduct(type: string): void {
    this.shipProduct = type === this.shipProduct ? undefined : type;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
