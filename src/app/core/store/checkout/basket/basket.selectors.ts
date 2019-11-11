import { createSelector } from '@ngrx/store';

import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView, createBasketView } from 'ish-core/models/basket/basket.model';
import { getCheckoutState } from 'ish-core/store/checkout/checkout-store';
import { getProductEntities } from 'ish-core/store/shopping/products';

const getBasketState = createSelector(
  getCheckoutState,
  state => state.basket
);

export const getBasketValidationResults = createSelector(
  getBasketState,
  getProductEntities,
  (basket, products): BasketValidationResultType => {
    if (!basket || !basket.validationResults) {
      return;
    }

    const basketResults = basket.validationResults;
    return {
      ...basketResults,
      infos: basketResults.infos
        ? basketResults.infos.map(info => ({
            ...info,
            parameters: { ...info.parameters, product: products[info.parameters.productSku] },
          }))
        : [],
    };
  }
);

export const getBasketInfo = createSelector(
  getBasketState,
  basket => basket.info
);

/**
 * Select the current basket with the appended product data and validation results for each line item.
 */
export const getCurrentBasket = createSelector(
  getBasketState,
  getProductEntities,
  getBasketValidationResults,
  getBasketInfo,
  (basket, products, validationResults, basketInfo): BasketView =>
    createBasketView(basket.basket, products, validationResults, basketInfo)
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
