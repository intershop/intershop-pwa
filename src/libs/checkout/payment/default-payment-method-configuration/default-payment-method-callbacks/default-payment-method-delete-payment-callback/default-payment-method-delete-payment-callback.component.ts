import { Injectable } from '@angular/core';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethodCallback } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.callback.interface';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

@Injectable()
export class DefaultPaymentMethodDeletePaymentCallbackComponent implements PaymentMethodCallback {
  constructor(private checkoutFacade: CheckoutFacade) {}

  name = 'deletePaymentInstrument';

  callback = (p: PaymentInstrument) => {
    this.checkoutFacade.deleteBasketPayment(p);
  };
}
