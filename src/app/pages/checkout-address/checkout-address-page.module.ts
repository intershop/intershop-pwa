import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutAddressAnonymousComponent } from './checkout-address-anonymous/checkout-address-anonymous.component';
import { CheckoutAddressPageComponent } from './checkout-address-page.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutAddressAnonymousComponent, CheckoutAddressComponent, CheckoutAddressPageComponent],
})
export class CheckoutAddressPageModule {
  static component = CheckoutAddressPageComponent;
}
