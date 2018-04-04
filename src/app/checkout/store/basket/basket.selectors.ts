import { createSelector } from '@ngrx/store';
import { CheckoutState, getCheckoutState } from '../checkout.state';
import { getBasket } from './basket.reducer';

const getBasketState = createSelector(
  getCheckoutState, (state: CheckoutState) => state.basket
);

export const getCurrentBasket = createSelector(getBasketState, getBasket);
