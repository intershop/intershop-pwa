import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { CheckoutPaymentPageContainerComponent } from './checkout-payment-page.container';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { PaymentConcardisCreditcardComponent } from './components/payment-concardis-creditcard/payment-concardis-creditcard.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutPaymentComponent, CheckoutPaymentPageContainerComponent, PaymentConcardisCreditcardComponent],
})
export class CheckoutPaymentPageModule {
  static component = CheckoutPaymentPageContainerComponent;
}
