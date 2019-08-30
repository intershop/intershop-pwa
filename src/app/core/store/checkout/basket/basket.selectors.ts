import { createSelector } from '@ngrx/store';

import { BasketView, createBasketView } from 'ish-core/models/basket/basket.model';
import { getProductEntities } from '../../shopping/products';
import { getCheckoutState } from '../checkout-store';

const getBasketState = createSelector(
  getCheckoutState,
  state => state.basket
);

/**
 * Select the current basket with the appended product data for each line item.
 */
export const getCurrentBasket = createSelector(
  getBasketState,
  getProductEntities,
  (basket, products): BasketView => createBasketView(basket.basket, products)
);

export const getCurrentBasketId = createSelector(
  getBasketState,
  basket => (basket.basket ? basket.basket.id : undefined)
);

export const getBasketLoading = createSelector(
  getBasketState,
  basket => basket.loading
);

export const getBasketError = createSelector(
  getBasketState,
  basket => basket.error
);

export const getBasketPromotionError = createSelector(
  getBasketState,
  basket => basket.promotionError
);

export const getBasketLastTimeProductAdded = createSelector(
  getBasketState,
  basket => basket.lastTimeProductAdded
);

export const getBasketEligibleShippingMethods = createSelector(
  getBasketState,
  basket => basket.eligibleShippingMethods
);

export const getBasketEligiblePaymentMethods = createSelector(
  getBasketState,
  basket => basket.eligiblePaymentMethods
);
