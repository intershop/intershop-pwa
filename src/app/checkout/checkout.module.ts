import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { checkoutEffects, checkoutReducers } from './store/checkout.system';

@NgModule({
  imports: [
    // ShoppingRoutingModule,
    StoreModule.forFeature('checkout', checkoutReducers),
    EffectsModule.forFeature(checkoutEffects)
  ],
  providers: [
  ]
})

export class CheckoutModule { }
