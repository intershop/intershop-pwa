import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { PaymentMethodConfiguration } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';

export class DemoPaymentMethodConfiguration implements PaymentMethodConfiguration {
  id = 'ISH_INVOICE';
  getFormlyFieldConfig(paymentMethod: PaymentMethod): FormlyFieldConfig {
    return {
      type: 'ish-radio-field',
      wrappers: ['ish-payment-method-wrapper', 'form-field-checkbox-horizontal'],
      templateOptions: {
        paymentMethod,
        label: paymentMethod.displayName,
      },
    };
  }
}
