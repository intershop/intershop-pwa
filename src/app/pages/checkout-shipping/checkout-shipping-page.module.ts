import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutShippingPageComponent } from './checkout-shipping-page.component';
import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutShippingComponent, CheckoutShippingPageComponent],
})
export class CheckoutShippingPageModule {
  static component = CheckoutShippingPageComponent;
}
