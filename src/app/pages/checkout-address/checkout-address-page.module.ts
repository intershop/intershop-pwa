import { NgModule } from '@angular/core';

import { AddressFormsSharedModule } from '../../shared/address-forms/address-forms.module';
import { SharedModule } from '../../shared/shared.module';

import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';
import { CheckoutAddressAnonymousComponent } from './components/checkout-address-anonymous/checkout-address-anonymous.component';
import { CheckoutAddressComponent } from './components/checkout-address/checkout-address.component';

@NgModule({
  imports: [AddressFormsSharedModule, SharedModule],
  declarations: [CheckoutAddressAnonymousComponent, CheckoutAddressComponent, CheckoutAddressPageContainerComponent],
})
export class CheckoutAddressPageModule {
  static component = CheckoutAddressPageContainerComponent;
}
