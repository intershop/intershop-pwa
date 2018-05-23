import { createFeatureSelector } from '@ngrx/store';
import { AddressesState } from './addresses/addresses.reducer';
import { BasketState } from './basket/basket.reducer';

export interface CheckoutState {
  basket: BasketState;
  addresses: AddressesState;
}

export const getCheckoutState = createFeatureSelector<CheckoutState>('checkout');
