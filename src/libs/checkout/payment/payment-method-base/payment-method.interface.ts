import { InjectionToken } from '@angular/core';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentInstrument } from './models/payment-instrument.model';

export interface PaymentMethodConfiguration {
  id: string;
  getFormlyFieldConfig(
    paymentMethod: PaymentMethod,
    deletePaymentInstrumentCallback?: (paymentInstrument: PaymentInstrument) => void
  ): FormlyFieldConfig;
}

export const PAYMENT_METHOD = new InjectionToken<PaymentMethodConfiguration>('paymentMethod');
