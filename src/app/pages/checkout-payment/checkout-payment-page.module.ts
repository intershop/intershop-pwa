import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedBasketModule } from '../../shared/shared-basket.module';
import { SharedModule } from '../../shared/shared.module';

import { CheckoutPaymentPageContainerComponent } from './checkout-payment-page.container';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';

@NgModule({
  imports: [ReactiveFormsModule, SharedBasketModule, SharedModule],
  declarations: [CheckoutPaymentComponent, CheckoutPaymentPageContainerComponent],
})
export class CheckoutPaymentPageModule {
  static component = CheckoutPaymentPageContainerComponent;
}
