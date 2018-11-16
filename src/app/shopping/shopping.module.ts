import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ShoppingRoutingModule } from './shopping-routing.module';
import { shoppingEffects, shoppingReducers } from './store/shopping.system';

@NgModule({
  imports: [
    EffectsModule.forFeature(shoppingEffects),
    ShoppingRoutingModule,
    StoreModule.forFeature('shopping', shoppingReducers),
  ],
})
export class ShoppingModule {}
