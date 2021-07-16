import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { RadioFieldComponent } from 'ish-shared/formly/types/radio-field/radio-field.component';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutShippingPageComponent } from './checkout-shipping-page.component';
import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping.component';
import { ShippingInfoComponent } from './formly/shipping-info/shipping-info.component';
import { ShippingRadioWrapperComponent } from './formly/shipping-radio-wrapper/shipping-radio-wrapper.component';

@NgModule({
  imports: [
    SharedModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'ish-radio-field',
          component: RadioFieldComponent,
          wrappers: ['shipping-radio-wrapper'],
        },
      ],
      wrappers: [
        {
          name: 'shipping-radio-wrapper',
          component: ShippingRadioWrapperComponent,
        },
      ],
    }),
  ],
  declarations: [
    CheckoutShippingComponent,
    CheckoutShippingPageComponent,
    ShippingInfoComponent,
    ShippingRadioWrapperComponent,
  ],
})
export class CheckoutShippingPageModule {
  static component = CheckoutShippingPageComponent;
}
