import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutAddressAnonymousComponent } from './checkout-address-anonymous/checkout-address-anonymous.component';
import { CheckoutAddressPageComponent } from './checkout-address-page.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { CheckoutAddressAnonymousFormComponent } from './formly/components/checkout-address-anonymous-form/checkout-address-anonymous-form.component';

@NgModule({
  declarations: [
    CheckoutAddressAnonymousComponent,
    CheckoutAddressAnonymousFormComponent,
    CheckoutAddressComponent,
    CheckoutAddressPageComponent,
  ],
  imports: [SharedModule],
})
export class CheckoutAddressPageModule {
  static component = CheckoutAddressPageComponent;
}
