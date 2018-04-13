import { createSelector } from '@ngrx/store';
import { getCheckoutState } from '../checkout.state';

const getBasketState = createSelector(
  getCheckoutState, state => state.basket
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
