import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { shoppingEffects, shoppingReducers } from './shopping.system';

@NgModule({
  imports: [EffectsModule.forFeature(shoppingEffects), StoreModule.forFeature('shopping', shoppingReducers)],
})
export class ShoppingModule {}
