import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'ish-shared/shared.module';

import { SpaCheckoutShippingPageComponent } from './spa-checkout-shipping-page.component';
import { SpaCheckoutShippingComponent } from './spa-checkout-shipping/spa-checkout-shipping.component';

@NgModule({
  imports: [ReactiveFormsModule, SharedModule],
  declarations: [SpaCheckoutShippingComponent, SpaCheckoutShippingPageComponent],
  exports: [SpaCheckoutShippingPageComponent],
})
export class SpaCheckoutShippingPageModule {}
