import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';
import { CheckoutAddressAnonymousComponent } from './components/checkout-address-anonymous/checkout-address-anonymous.component';
import { CheckoutAddressComponent } from './components/checkout-address/checkout-address.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutAddressAnonymousComponent, CheckoutAddressComponent, CheckoutAddressPageContainerComponent],
})
export class CheckoutAddressPageModule {
  static component = CheckoutAddressPageContainerComponent;
}
