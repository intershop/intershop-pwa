import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { AddressHelper } from 'ish-core/models/address/address.helper';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView, createBasketView } from 'ish-core/models/basket/basket.model';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { getCheckoutState } from 'ish-core/store/checkout/checkout-store';
import { getCategoryTree } from 'ish-core/store/shopping/categories';
import { getProductEntities } from 'ish-core/store/shopping/products';
import { getLoggedInCustomer } from 'ish-core/store/user';

const getBasketState = createSelector(
  getCheckoutState,
  state => state.basket
);

export const getBasketValidationResults = createSelector(
  getBasketState,
  getProductEntities,
  getCategoryTree,
  (basket, products, categoryTree): BasketValidationResultType => {
    if (!basket || !basket.validationResults) {
      return;
    }

    const basketResults = basket.validationResults;
    return {
      ...basketResults,
      infos: basketResults.infos
        ? basketResults.infos.map(info => ({
            ...info,
            product: info.parameters && createProductView(products[info.parameters.productSku], categoryTree),
          }))
        : [],
      errors: basketResults.errors
        ? basketResults.errors.map(error => ({
            ...error,
            lineItem: error.parameters &&
              error.parameters.lineItemId && {
                ...basket.basket.lineItems.find(item => item.id === error.parameters.lineItemId),
              },
            product:
              error.parameters &&
              error.parameters.lineItemId &&
              basket.basket.lineItems.find(item => item.id === error.parameters.lineItemId) &&
              createProductView(
                products[basket.basket.lineItems.find(item => item.id === error.parameters.lineItemId).productSKU],
                categoryTree
              ),
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
  getCategoryTree,
  (basket, products, validationResults, basketInfo, categoryTree): BasketView =>
    createBasketView(basket.basket, products, validationResults, basketInfo, categoryTree)
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
  getLoggedInCustomer,
  (basket, customer) =>
    basket &&
    basket.eligiblePaymentMethods &&
    basket.eligiblePaymentMethods.map(pm => (customer ? pm : { ...pm, saveAllowed: false }))
);

export const getBasketInvoiceAddress = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getCurrentBasket, basket => basket && basket.invoiceToAddress);

export const getBasketShippingAddress = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getCurrentBasket, basket => basket && basket.commonShipToAddress);

export const isBasketInvoiceAndShippingAddressEqual = createSelector(
  getBasketInvoiceAddress,
  getBasketShippingAddress,
  AddressHelper.equal
);
