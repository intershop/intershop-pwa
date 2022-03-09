import { NgModule } from '@angular/core';
import { PaymentMethodBaseModule } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-base.module';
import { PAYMENT_METHOD } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';

import { DemoPaymentMethod } from './demo-payment-method';

@NgModule({
  imports: [PaymentMethodBaseModule],
  providers: [{ provide: PAYMENT_METHOD, useClass: DemoPaymentMethod, multi: true }],
})
export class DemoPaymentMethodModule {}
