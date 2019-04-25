import { createFeatureSelector } from '@ngrx/store';

import { BasketState } from './basket/basket.reducer';
import { ViewconfState } from './viewconf/viewconf.reducer';

export interface CheckoutState {
  basket: BasketState;
  viewconf: ViewconfState;
}

export const getCheckoutState = createFeatureSelector<CheckoutState>('checkout');
