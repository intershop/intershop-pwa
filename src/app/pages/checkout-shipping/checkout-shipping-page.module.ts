import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedBasketModule } from '../../shared/shared-basket.module';
import { SharedModule } from '../../shared/shared.module';

import { CheckoutShippingPageContainerComponent } from './checkout-shipping-page.container';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';

@NgModule({
  imports: [ReactiveFormsModule, SharedBasketModule, SharedModule],
  declarations: [CheckoutShippingComponent, CheckoutShippingPageContainerComponent],
})
export class CheckoutShippingPageModule {
  static component = CheckoutShippingPageContainerComponent;
}
