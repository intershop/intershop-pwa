import { NgModule } from '@angular/core';
import { PaymentMethodBaseModule } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-base.module';
import { PAYMENT_METHOD } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';

import { DemoPaymentMethodConfiguration } from './demo-payment-method-configuration';

@NgModule({
  imports: [PaymentMethodBaseModule],
  providers: [{ provide: PAYMENT_METHOD, useClass: DemoPaymentMethodConfiguration, multi: true }],
})
export class DemoPaymentMethodConfigurationModule {}
