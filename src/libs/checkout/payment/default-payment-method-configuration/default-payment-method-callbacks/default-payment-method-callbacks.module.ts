import { NgModule } from '@angular/core';
import { PAYMENT_METHOD_CALLBACK } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.callback.interface';

import { DefaultPaymentMethodDeletePaymentCallbackComponent } from './default-payment-method-delete-payment-callback/default-payment-method-delete-payment-callback.component';

@NgModule({
  providers: [
    { provide: PAYMENT_METHOD_CALLBACK, useClass: DefaultPaymentMethodDeletePaymentCallbackComponent, multi: true },
  ],
})
export class DefaultPaymentMethodCallbacksModule {}
