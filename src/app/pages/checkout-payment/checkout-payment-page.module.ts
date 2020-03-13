import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutPaymentPageComponent } from './checkout-payment-page.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { PaymentConcardisCreditcardComponent } from './checkout-payment/payment-concardis/payment-concardis-creditcard/payment-concardis-creditcard.component';
import { PaymentConcardisDirectdebitComponent } from './checkout-payment/payment-concardis/payment-concardis-directdebit/payment-concardis-directdebit.component';
import { PaymentConcardisComponent } from './checkout-payment/payment-concardis/payment-concardis.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CheckoutPaymentComponent,
    CheckoutPaymentPageComponent,
    PaymentConcardisComponent,
    PaymentConcardisCreditcardComponent,
    PaymentConcardisDirectdebitComponent,
  ],
})
export class CheckoutPaymentPageModule {
  static component = CheckoutPaymentPageComponent;
}
