import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutPaymentPageComponent } from './checkout-payment-page.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { PaymentConcardisCreditcardComponent } from './payment-concardis-creditcard/payment-concardis-creditcard.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutPaymentComponent, CheckoutPaymentPageComponent, PaymentConcardisCreditcardComponent],
})
export class CheckoutPaymentPageModule {
  static component = CheckoutPaymentPageComponent;
}
