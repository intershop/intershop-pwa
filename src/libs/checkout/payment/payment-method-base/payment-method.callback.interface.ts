import { InjectionToken } from '@angular/core';

import { PaymentInstrument } from './models/payment-instrument.model';

export interface PaymentMethodCallback {
  name: string;
  callback(paymentInstrument: PaymentInstrument): void;
}

export const PAYMENT_METHOD_CALLBACK = new InjectionToken<PaymentMethodCallback>('paymentMethodCallback');
