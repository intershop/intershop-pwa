import { createSelector } from '@ngrx/store';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Product } from '../../../models/product/product.model';
import { getProductEntities } from '../../../shopping/store/products';
import { getCheckoutState } from '../checkout.state';

const getBasketState = createSelector(getCheckoutState, state => state.basket);

/**
 * Select the current basket with the appended product data for each line item.
 */
export const getCurrentBasket = createSelector(getBasketState, getProductEntities, (basket, products) => {
  if (!basket.basket || !basket.basket.lineItems) {
    return null;
  }

  const lineItems = basket.basket.lineItems;
  const updatedLineItems: BasketItem[] = [];

  for (const item of lineItems) {
    const lineItem = { ...item };
    const product = item.product as Product;

    if (product && product.sku) {
      updatedLineItems.push(lineItem);
      lineItem.product = products[product.sku];
    }
  }

  return {
    ...basket.basket,
    lineItems: updatedLineItems,
  };
});

export const getBasketLoading = createSelector(getBasketState, basket => basket.loading);

export const getBasketError = createSelector(getBasketState, basket => basket.error);
