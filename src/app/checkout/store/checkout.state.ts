import { createFeatureSelector } from '@ngrx/store';
import { BasketState } from './basket/basket.reducer';

export interface CheckoutState {
  basket: BasketState;
}

export const getCheckoutState = createFeatureSelector<CheckoutState>('checkout');
