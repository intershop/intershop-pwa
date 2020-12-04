import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { SpaCheckoutShippingPaymentPageComponent } from './spa-checkout-shipping-payment-page.component';
import { SpaCheckoutShippingPaymentComponent } from './spa-checkout-shipping-payment/spa-checkout-shipping-payment.component';
import { SpaCheckoutShippingPageModule } from '../spa-checkout-shipping/spa-checkout-shipping-page.module';
import { SpaCheckoutPaymentPageModule } from '../spa-checkout-payment/spa-checkout-payment-page.module';

@NgModule({
  declarations: [SpaCheckoutShippingPaymentPageComponent, SpaCheckoutShippingPaymentComponent],
  imports: [SharedModule, SpaCheckoutShippingPageModule, SpaCheckoutPaymentPageModule],
  exports: [SpaCheckoutShippingPaymentPageComponent],
})
export class SpaCheckoutShippingPaymentPageModule {}
