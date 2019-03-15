import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { ViewconfEffects } from './viewconf/viewconf.effects';

import { AddressesEffects } from './addresses/addresses.effects';
import { addressesReducer } from './addresses/addresses.reducer';
import { BasketAddressesEffects } from './basket/basket-addresses.effects';
import { BasketItemsEffects } from './basket/basket-items.effects';
import { BasketEffects } from './basket/basket.effects';
import { basketReducer } from './basket/basket.reducer';
import { CheckoutState } from './checkout-store';
import { viewconfReducer } from './viewconf/viewconf.reducer';

export const checkoutReducers: ActionReducerMap<CheckoutState> = {
  basket: basketReducer,
  addresses: addressesReducer,
  viewconf: viewconfReducer,
};

export const checkoutEffects = [
  BasketEffects,
  BasketAddressesEffects,
  BasketItemsEffects,
  AddressesEffects,
  ViewconfEffects,
];

@NgModule({
  imports: [EffectsModule.forFeature(checkoutEffects), StoreModule.forFeature('checkout', checkoutReducers)],
})
export class CheckoutStoreModule {}
