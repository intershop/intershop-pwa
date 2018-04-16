import { createSelector } from '@ngrx/store';
import { getCheckoutState } from '../checkout.state';

const getBasketState = createSelector(getCheckoutState, state => state.basket);

export const getCurrentBasket = createSelector(getBasketState, basket => basket.basket);

export const getBasketLoading = createSelector(getBasketState, basket => basket.loading);

export const getBasketError = createSelector(getBasketState, basket => basket.error);
