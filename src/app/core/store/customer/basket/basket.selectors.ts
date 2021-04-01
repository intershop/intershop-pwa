import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView, createBasketView } from 'ish-core/models/basket/basket.model';
import { getCustomerState } from 'ish-core/store/customer/customer-store';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

const getBasketState = createSelector(getCustomerState, state => state && state.basket);

export const getBasketValidationResults = createSelector(
  getBasketState,
  (basket): BasketValidationResultType => {
    if (!basket || !basket.validationResults) {
      return;
    }

    const basketResults = basket.validationResults;
    return {
      ...basketResults,
      infos: basketResults.infos || [],
      errors: basketResults.errors
        ? basketResults.errors.map(error => ({
            ...error,
            lineItem: error.parameters &&
              error.parameters.lineItemId && {
                ...basket.basket.lineItems.find(item => item.id === error.parameters.lineItemId),
              },
          }))
        : [],
    };
  }
);

export const getBasketInfo = createSelector(getBasketState, basket => basket.info);

export const getCurrentBasket = createSelector(
  getBasketState,
  getBasketValidationResults,
  getBasketInfo,
  (basket, validationResults, basketInfo): BasketView => createBasketView(basket.basket, validationResults, basketInfo)
);

export const getSubmittedBasket = createSelector(
  getBasketState,
  getBasketValidationResults,
  getBasketInfo,
  (basket, validationResults, basketInfo): BasketView =>
    createBasketView(basket.submittedBasket, validationResults, basketInfo)
);

export const getCurrentBasketId = createSelector(getBasketState, basket =>
  basket.basket ? basket.basket.id : undefined
);

export const getBasketIdOrCurrent = createSelector(getBasketState, basket =>
  basket.basket ? basket.basket.id : 'current'
);

export const getBasketLoading = createSelector(getBasketState, basket => basket.loading);

export const getBasketError = createSelector(getBasketState, basket => basket.error);

export const getBasketPromotionError = createSelector(getBasketState, basket => basket.promotionError);

export const getBasketLastTimeProductAdded = createSelector(getBasketState, basket => basket.lastTimeProductAdded);

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

export const getBasketInvoiceAddress = createSelectorFactory<object, Address>(projector =>
  resultMemoize(projector, isEqual)
)(getCurrentBasket, (basket: BasketView) => basket?.invoiceToAddress);

export const getBasketShippingAddress = createSelectorFactory<object, Address>(projector =>
  resultMemoize(projector, isEqual)
)(getCurrentBasket, (basket: BasketView) => basket?.commonShipToAddress);

export const isBasketInvoiceAndShippingAddressEqual = createSelector(
  getBasketInvoiceAddress,
  getBasketShippingAddress,
  AddressHelper.equal
);
