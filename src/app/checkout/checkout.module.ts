import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BasketService } from './services/basket/basket.service';
import { checkoutEffects, checkoutReducers } from './store/checkout.system';

@NgModule({
  imports: [
    // ShoppingRoutingModule,
    StoreModule.forFeature('checkout', checkoutReducers),
    EffectsModule.forFeature(checkoutEffects)
  ],
  providers: [
    BasketService
  ]
})

export class CheckoutModule { }
