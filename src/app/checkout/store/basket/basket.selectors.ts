import { createSelector } from '@ngrx/store';
import { CheckoutState, getCheckoutState } from '../checkout.state';

const getBasketState = createSelector(
  getCheckoutState, (state: CheckoutState) => state.basket
);

export const getCurrentBasket = createSelector(
  getBasketState,
  basket => basket.basket
);

export const getCurrentBasketLoading = createSelector(
  getBasketState,
  basket => basket.loading
);

export const getCurrentBasketLoadingError = createSelector(
  getBasketState,
  basket => basket.error
);
