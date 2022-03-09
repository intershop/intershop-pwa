import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { PaymentMethodProvider } from '../payment-method-provider/payment-method.provider';

/**
 * The Checkout Payment Component renders the checkout payment page. On this page the user can select a payment method. Some payment methods require the user to enter some additional data, like credit card data. For some payment methods there is special javascript functionality necessary provided by an external payment host. See also {@link CheckoutPaymentPageComponent}
 *
 */
@Component({
  selector: 'ish-checkout-payment',
  templateUrl: './checkout-payment.component.b2b.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [PaymentMethodProvider],
})
export class CheckoutPaymentComponent {
  @Input() basket: Basket;
  @Input() paymentMethods: PaymentMethod[];
  @Input() priceType: 'gross' | 'net';
  @Input() error: HttpError;

  @Output() updatePaymentMethod = new EventEmitter<string>();
  @Output() createPaymentInstrument = new EventEmitter<{
    paymentInstrument: PaymentInstrument;
    saveForLater: boolean;
  }>();
  @Output() deletePaymentInstrument = new EventEmitter<PaymentInstrument>();
  @Output() nextStep = new EventEmitter<void>();

  paymentMethods$: Observable<FormlyFieldConfig[]>;
  formGroup = new FormGroup({});

  constructor(private paymentMethodProvider: PaymentMethodProvider) {
    this.paymentMethods$ = paymentMethodProvider.getPaymentMethodConfig$();
  }
}
