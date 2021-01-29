import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutPaymentPageComponent } from './checkout-payment-page.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { PaymentConcardisCreditcardCvcDetailComponent } from './payment-concardis-creditcard-cvc-detail/payment-concardis-creditcard-cvc-detail.component';
import { PaymentConcardisCreditcardComponent } from './payment-concardis-creditcard/payment-concardis-creditcard.component';
import { PaymentConcardisDirectdebitComponent } from './payment-concardis-directdebit/payment-concardis-directdebit.component';
import { PaymentConcardisComponent } from './payment-concardis/payment-concardis.component';
import { PaymentCybersourceCreditcardComponent } from './payment-cybersource-creditcard/payment-cybersource-creditcard.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CheckoutPaymentComponent,
    CheckoutPaymentPageComponent,
    PaymentConcardisComponent,
    PaymentConcardisCreditcardComponent,
    PaymentConcardisCreditcardCvcDetailComponent,
    PaymentConcardisDirectdebitComponent,
    PaymentCybersourceCreditcardComponent,
  ],
})
export class CheckoutPaymentPageModule {
  static component = CheckoutPaymentPageComponent;
}
