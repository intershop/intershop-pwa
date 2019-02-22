import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { CheckoutPaymentPageContainerComponent } from './checkout-payment-page.container';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutPaymentComponent, CheckoutPaymentPageContainerComponent],
})
export class CheckoutPaymentPageModule {
  static component = CheckoutPaymentPageContainerComponent;
}
