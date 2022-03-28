import { NgModule } from '@angular/core';
import { PaymentMethodBaseModule } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-base.module';
import { PAYMENT_METHOD } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';

import { DefaultPaymentMethodConfigurationComponent } from './default-payment-method-configuration';

@NgModule({
  imports: [PaymentMethodBaseModule],
  providers: [{ provide: PAYMENT_METHOD, useClass: DefaultPaymentMethodConfigurationComponent, multi: true }],
})
export class DefaultPaymentMethodConfigurationModule {}
