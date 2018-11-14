import { NgModule } from '@angular/core';

import { FormsAddressModule } from '../../forms/forms-address.module';
import { SharedModule } from '../../shared/shared.module';

import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';
import { CheckoutAddressComponent } from './components/checkout-address/checkout-address.component';

@NgModule({
  imports: [FormsAddressModule, SharedModule],
  declarations: [CheckoutAddressComponent, CheckoutAddressPageContainerComponent],
})
export class CheckoutAddressPageModule {
  static component = CheckoutAddressPageContainerComponent;
}
