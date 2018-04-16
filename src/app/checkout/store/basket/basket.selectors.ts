import { createSelector } from '@ngrx/store';
import { BasketItem } from '../../../models/basket/basket-item.model';
import * as productsSelectors from '../../../shopping/store/products/products.selectors';
import { getCheckoutState } from '../checkout.state';

const getBasketState = createSelector(getCheckoutState, state => state.basket);

/**
 * get current basket, appends product data
 */
export const getCurrentBasket = createSelector(
  getBasketState,
  productsSelectors.getProductEntities,
  (basket, products) => {
    if (!basket.basket) {
      return null;
    }

    const lineItems = basket.basket.lineItems;
    const updatedLineItems: BasketItem[] = [];

    for (const item of lineItems) {
      const lineItem = {
        ...item,
      };

      if (item.product && item.product['title']) {
        const sku = item.product['title'];
        updatedLineItems.push(lineItem);

        lineItem.product = products[sku];
      }
    }

    return {
      ...basket.basket,
      lineItems: updatedLineItems,
    };
  }
);

export const getBasketLoading = createSelector(getBasketState, basket => basket.loading);

export const getBasketError = createSelector(getBasketState, basket => basket.error);
