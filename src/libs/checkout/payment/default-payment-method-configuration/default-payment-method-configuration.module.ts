import { NgModule } from '@angular/core';
import { PaymentMethodBaseModule } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-base.module';
import { PAYMENT_METHOD } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';

import { DefaultPaymentMethodCallbacksModule } from './default-payment-method-callbacks/default-payment-method-callbacks.module';
import { DefaultPaymentMethodConfigurationComponent } from './default-payment-method-configuration';

@NgModule({
  imports: [DefaultPaymentMethodCallbacksModule, PaymentMethodBaseModule],
  providers: [{ provide: PAYMENT_METHOD, useClass: DefaultPaymentMethodConfigurationComponent, multi: true }],
})
export class DefaultPaymentMethodConfigurationModule {}
