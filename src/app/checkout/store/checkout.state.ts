import { createFeatureSelector } from '@ngrx/store';
import { AddressesState } from './addresses/addresses.reducer';
import { BasketState } from './basket/basket.reducer';
import { ViewconfState } from './viewconf/viewconf.reducer';

export interface CheckoutState {
  basket: BasketState;
  addresses: AddressesState;
  viewconf: ViewconfState;
}

export const getCheckoutState = createFeatureSelector<CheckoutState>('checkout');
