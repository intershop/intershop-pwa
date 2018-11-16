import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { checkoutEffects, checkoutReducers } from './store/checkout.system';

@NgModule({
  imports: [
    CheckoutRoutingModule,
    EffectsModule.forFeature(checkoutEffects),
    StoreModule.forFeature('checkout', checkoutReducers),
  ],
})
export class CheckoutModule {}
