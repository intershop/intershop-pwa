import { ActionReducerMap } from '@ngrx/store';

import { AddressesEffects } from './addresses/addresses.effects';
import { addressesReducer } from './addresses/addresses.reducer';
import { BasketEffects } from './basket/basket.effects';
import { basketReducer } from './basket/basket.reducer';
import { CheckoutState } from './checkout.state';
import { ViewconfEffects } from './viewconf/viewconf.effects';
import { viewconfReducer } from './viewconf/viewconf.reducer';

export const checkoutReducers: ActionReducerMap<CheckoutState> = {
  basket: basketReducer,
  addresses: addressesReducer,
  viewconf: viewconfReducer,
};

export const checkoutEffects = [BasketEffects, AddressesEffects, ViewconfEffects];
