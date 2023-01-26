import { createReducer, on } from '@ngrx/store';
import { unionBy } from 'lodash-es';

import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  addPromotionCodeToBasket,
  addPromotionCodeToBasketFail,
  addPromotionCodeToBasketSuccess,
  assignBasketAddress,
  continueCheckout,
  continueCheckoutFail,
  continueCheckoutSuccess,
  continueCheckoutWithIssues,
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  createBasketSuccess,
  deleteBasketAttribute,
  deleteBasketAttributeFail,
  deleteBasketAttributeSuccess,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  loadBasket,
  loadBasketByAPIToken,
  loadBasketEligiblePaymentMethods,
  loadBasketEligiblePaymentMethodsFail,
  loadBasketEligiblePaymentMethodsSuccess,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  loadBasketWithId,
  mergeBasketFail,
  mergeBasketInProgress,
  mergeBasketSuccess,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
  resetBasketErrors,
  setBasketAttribute,
  setBasketAttributeFail,
  setBasketAttributeSuccess,
  setBasketDesiredDeliveryDate,
  setBasketDesiredDeliveryDateFail,
  setBasketDesiredDeliveryDateSuccess,
  setBasketPayment,
  setBasketPaymentFail,
  setBasketPaymentSuccess,
  startCheckout,
  startCheckoutFail,
  startCheckoutSuccess,
  submitBasket,
  submitBasketFail,
  submitBasketSuccess,
  updateBasket,
  updateBasketFail,
  updateBasketItem,
  updateBasketItemFail,
  updateBasketItemSuccess,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  updateBasketPayment,
  updateBasketPaymentFail,
  updateBasketPaymentSuccess,
  updateBasketShippingMethod,
  updateConcardisCvcLastUpdated,
  updateConcardisCvcLastUpdatedFail,
  updateConcardisCvcLastUpdatedSuccess,
} from './basket.actions';

export interface BasketState {
  basket: Basket;
  eligibleShippingMethods: ShippingMethod[];
  eligiblePaymentMethods: PaymentMethod[];
  loading: boolean;
  promotionError: HttpError; // for promotion-errors
  error: HttpError; // add, update and delete errors
  info: BasketInfo[];
  lastTimeProductAdded: number;
  validationResults: BasketValidationResultType;
  submittedBasket: Basket;
}

const initialValidationResults: BasketValidationResultType = {
  valid: undefined,
  adjusted: undefined,
  errors: [],
};

const initialState: BasketState = {
  basket: undefined,
  eligibleShippingMethods: undefined,
  eligiblePaymentMethods: undefined,
  loading: false,
  error: undefined,
  info: undefined,
  promotionError: undefined,
  lastTimeProductAdded: undefined,
  validationResults: initialValidationResults,
  submittedBasket: undefined,
};

export const basketReducer = createReducer(
  initialState,
  setLoadingOn(
    loadBasket,
    loadBasketWithId,
    loadBasketByAPIToken,
    assignBasketAddress,
    updateBasketShippingMethod,
    updateBasket,
    addProductToBasket,
    addPromotionCodeToBasket,
    removePromotionCodeFromBasket,
    addItemsToBasket,
    continueCheckout,
    updateBasketItem,
    updateBasketItems,
    deleteBasketItem,
    setBasketAttribute,
    deleteBasketAttribute,
    loadBasketEligibleShippingMethods,
    loadBasketEligiblePaymentMethods,
    setBasketPayment,
    createBasketPayment,
    updateBasketPayment,
    deleteBasketPayment,
    submitBasket,
    updateConcardisCvcLastUpdated,
    startCheckout,
    mergeBasketInProgress,
    setBasketDesiredDeliveryDate
  ),
  unsetLoadingOn(addPromotionCodeToBasketSuccess, addPromotionCodeToBasketFail, loadBasketSuccess),
  unsetLoadingAndErrorOn(
    mergeBasketSuccess,
    updateBasketItemSuccess,
    updateBasketItemsSuccess,
    deleteBasketItemSuccess,
    addItemsToBasketSuccess,
    setBasketPaymentSuccess,
    createBasketPaymentSuccess,
    updateBasketPaymentSuccess,
    deleteBasketPaymentSuccess,
    removePromotionCodeFromBasketSuccess,
    continueCheckoutSuccess,
    continueCheckoutWithIssues,
    loadBasketEligibleShippingMethodsSuccess,
    loadBasketEligiblePaymentMethodsSuccess,
    updateConcardisCvcLastUpdatedSuccess,
    submitBasketSuccess,
    startCheckoutSuccess,
    setBasketDesiredDeliveryDateSuccess
  ),
  setErrorOn(
    mergeBasketFail,
    loadBasketFail,
    updateBasketFail,
    continueCheckoutFail,
    addItemsToBasketFail,
    removePromotionCodeFromBasketFail,
    updateBasketItemFail,
    updateBasketItemsFail,
    deleteBasketItemFail,
    setBasketAttributeFail,
    deleteBasketAttributeFail,
    loadBasketEligibleShippingMethodsFail,
    loadBasketEligiblePaymentMethodsFail,
    setBasketPaymentFail,
    createBasketPaymentFail,
    updateBasketPaymentFail,
    deleteBasketPaymentFail,
    updateConcardisCvcLastUpdatedFail,
    submitBasketFail,
    startCheckoutFail,
    setBasketDesiredDeliveryDateFail
  ),

  on(loadBasketSuccess, createBasketSuccess, mergeBasketSuccess, (state, action): BasketState => {
    const basket = {
      ...action.payload.basket,
    };

    return {
      ...state,
      basket,
      submittedBasket: undefined,
    };
  }),
  on(updateBasketItemSuccess, (state, action) => ({
    ...state,
    basket: {
      ...state.basket,
      lineItems: state.basket.lineItems.map(item =>
        item.id === action.payload.lineItem.id ? action.payload.lineItem : item
      ),
    },
    info: action.payload.info,
    validationResults: initialValidationResults,
  })),
  on(
    updateBasketItemsSuccess,
    (state, action): BasketState => ({
      ...state,
      info: action.payload.info,
      validationResults: initialValidationResults,
    })
  ),
  on(deleteBasketItemSuccess, (state, action) => ({
    ...state,
    basket: { ...state.basket, lineItems: state.basket.lineItems.filter(item => item.id !== action.payload.itemId) },
    info: action.payload.info,
    validationResults: initialValidationResults,
  })),
  on(addItemsToBasketSuccess, (state, action) => ({
    ...state,
    basket: { ...state.basket, lineItems: unionBy(action.payload.lineItems, state.basket.lineItems ?? [], 'id') },
    info: action.payload.info,
    error: action.payload.errors ? { name: 'HttpErrorResponse', errors: action.payload.errors } : undefined,
    lastTimeProductAdded: new Date().getTime(),
    submittedBasket: undefined,
  })),
  on(
    setBasketPaymentSuccess,
    createBasketPaymentSuccess,
    updateBasketPaymentSuccess,
    deleteBasketPaymentSuccess,
    removePromotionCodeFromBasketSuccess,
    setBasketAttributeSuccess,
    deleteBasketAttributeSuccess,
    (state): BasketState => ({
      ...state,
      validationResults: initialValidationResults,
    })
  ),
  on(startCheckoutSuccess, continueCheckoutSuccess, continueCheckoutWithIssues, (state, action): BasketState => {
    const validation = action.payload.basketValidation;
    const basket = validation?.results.adjusted && validation.basket ? validation.basket : state.basket;

    return {
      ...state,
      basket,
      info: undefined,
      submittedBasket: undefined,
      validationResults: validation?.results,
    };
  }),
  on(
    loadBasketEligibleShippingMethodsSuccess,
    (state, action): BasketState => ({
      ...state,
      eligibleShippingMethods: action.payload.shippingMethods,
    })
  ),
  on(
    loadBasketEligiblePaymentMethodsSuccess,
    (state, action): BasketState => ({
      ...state,
      eligiblePaymentMethods: action.payload.paymentMethods,
    })
  ),
  on(
    updateConcardisCvcLastUpdatedSuccess,
    (state, action): BasketState => ({
      ...state,
      basket: {
        ...state.basket,
        payment: {
          ...state.basket.payment,
          paymentInstrument: action.payload.paymentInstrument,
        },
      },
    })
  ),
  on(
    addPromotionCodeToBasketSuccess,
    (state): BasketState => ({
      ...state,
      promotionError: undefined,
    })
  ),

  on(addPromotionCodeToBasketFail, (state, action): BasketState => {
    const { error } = action.payload;

    return {
      ...state,
      promotionError: error,
    };
  }),

  on(createOrderSuccess, (): BasketState => initialState),
  on(
    submitBasketSuccess,
    (state): BasketState => ({
      ...state,
      submittedBasket: state.basket,
      basket: undefined,
      info: undefined,
      promotionError: undefined,
      validationResults: initialValidationResults,
    })
  ),

  on(
    resetBasketErrors,
    (state): BasketState => ({
      ...state,
      error: undefined,
      info: undefined,
      promotionError: undefined,
      validationResults: initialValidationResults,
    })
  )
);
