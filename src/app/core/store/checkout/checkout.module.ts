import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { checkoutEffects, checkoutReducers } from './checkout.system';

@NgModule({
  imports: [EffectsModule.forFeature(checkoutEffects), StoreModule.forFeature('checkout', checkoutReducers)],
})
export class CheckoutModule {}
