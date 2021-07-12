import { NgModule } from '@angular/core';
import { SharedModule } from 'ish-shared/shared.module';

import { SpaCheckoutAddressPageComponent } from './spa-checkout-address-page.component';
import { SpaCheckoutAddressComponent } from './spa-checkout-address/spa-checkout-address.component';
import { SpaCheckoutAddressAnonymousComponent } from './spa-checkout-address-anonymous/spa-checkout-address-anonymous.component';

@NgModule({
  imports: [SharedModule],
  declarations: [SpaCheckoutAddressComponent, SpaCheckoutAddressAnonymousComponent, SpaCheckoutAddressPageComponent],
  exports: [SpaCheckoutAddressPageComponent],
})
export class SpaCheckoutAddressPageModule {}
