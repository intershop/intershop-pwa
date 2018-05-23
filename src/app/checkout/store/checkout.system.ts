import { ActionReducerMap } from '@ngrx/store';
import { AddressesEffects } from './addresses/addresses.effects';
import { addressesReducer } from './addresses/addresses.reducer';
import { BasketEffects } from './basket/basket.effects';
import { basketReducer } from './basket/basket.reducer';
import { CheckoutState } from './checkout.state';

export const checkoutReducers: ActionReducerMap<CheckoutState> = {
  basket: basketReducer,
  addresses: addressesReducer,
};

// tslint:disable-next-line: no-any
export const checkoutEffects: any[] = [BasketEffects, AddressesEffects];
