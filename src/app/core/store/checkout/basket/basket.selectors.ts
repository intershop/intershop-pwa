import { createSelector } from '@ngrx/store';

import { BasketHelper, BasketView } from 'ish-core/models/basket/basket.model';
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
  (basket, products): BasketView =>
    !basket.basket
      ? undefined
      : {
          ...basket.basket,
          lineItems: basket.basket.lineItems.map(li => ({
            ...li,
            product: products[li.productSKU],
            name: products[li.productSKU] ? products[li.productSKU].name : undefined,
            inStock: products[li.productSKU] ? products[li.productSKU].inStock : undefined,
            availability: products[li.productSKU] ? products[li.productSKU].availability : undefined,
          })),
          itemsCount: BasketHelper.getBasketItemsCount(basket.basket.lineItems),
          payment: basket.payments[0],
        }
);

export const getBasketLoading = createSelector(
  getBasketState,
  basket => basket.loading
);

export const getBasketError = createSelector(
  getBasketState,
  basket => basket.error
);

export const getBasketEligibleShippingMethods = createSelector(
  getBasketState,
  basket => basket.eligibleShippingMethods
);

export const getBasketEligiblePaymentMethods = createSelector(
  getBasketState,
  basket => basket.eligiblePaymentMethods
);
