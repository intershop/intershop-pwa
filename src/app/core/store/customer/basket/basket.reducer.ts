import { createReducer, on } from '@ngrx/store';

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
  mergeBasketSuccess,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
  resetBasketErrors,
  setBasketAttribute,
  setBasketAttributeFail,
  setBasketAttributeSuccess,
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

export const initialState: BasketState = {
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
    assignBasketAddress,
    updateBasketShippingMethod,
    updateBasket,
    addProductToBasket,
    addPromotionCodeToBasket,
    removePromotionCodeFromBasket,
    addItemsToBasket,
    continueCheckout,
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
    startCheckout
  ),
  unsetLoadingOn(addPromotionCodeToBasketSuccess, addPromotionCodeToBasketFail),
  unsetLoadingAndErrorOn(
    loadBasketSuccess,
    mergeBasketSuccess,
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
    startCheckoutSuccess
  ),
  setErrorOn(
    mergeBasketFail,
    loadBasketFail,
    updateBasketFail,
    continueCheckoutFail,
    addItemsToBasketFail,
    removePromotionCodeFromBasketFail,
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
    startCheckoutFail
  ),

  on(loadBasketSuccess, createBasketSuccess, mergeBasketSuccess, (state, action) => {
    const basket = {
      ...action.payload.basket,
    };

    return {
      ...state,
      basket,
      submittedBasket: undefined,
    };
  }),
  on(updateBasketItemsSuccess, deleteBasketItemSuccess, (state, action) => ({
    ...state,
    info: action.payload.info,
    validationResults: initialValidationResults,
  })),
  on(addItemsToBasketSuccess, (state, action) => ({
    ...state,
    info: action.payload.info,
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
    state => ({
      ...state,
      validationResults: initialValidationResults,
    })
  ),
  on(startCheckoutSuccess, continueCheckoutSuccess, continueCheckoutWithIssues, (state, action) => {
    const validation = action.payload.basketValidation;
    const basket = validation && validation.results.adjusted && validation.basket ? validation.basket : state.basket;

    return {
      ...state,
      basket,
      info: undefined,
      submittedBasket: undefined,
      validationResults: validation && validation.results,
    };
  }),
  on(loadBasketEligibleShippingMethodsSuccess, (state, action) => ({
    ...state,
    eligibleShippingMethods: action.payload.shippingMethods,
  })),
  on(loadBasketEligiblePaymentMethodsSuccess, (state, action) => ({
    ...state,
    eligiblePaymentMethods: action.payload.paymentMethods,
  })),
  on(updateConcardisCvcLastUpdatedSuccess, (state, action) => ({
    ...state,
    basket: {
      ...state.basket,
      payment: {
        ...state.basket.payment,
        paymentInstrument: action.payload.paymentInstrument,
      },
    },
  })),
  on(addPromotionCodeToBasketSuccess, state => ({
    ...state,
    promotionError: undefined,
  })),

  on(addPromotionCodeToBasketFail, (state, action) => {
    const { error } = action.payload;

    return {
      ...state,
      promotionError: error,
    };
  }),

  on(createOrderSuccess, () => initialState),
  on(submitBasketSuccess, state => ({
    ...state,
    submittedBasket: state.basket,
    basket: undefined,
    info: undefined,
    promotionError: undefined,
    validationResults: initialValidationResults,
  })),

  on(resetBasketErrors, state => ({
    ...state,
    error: undefined,
    info: undefined,
    promotionError: undefined,
    validationResults: initialValidationResults,
  }))
);
