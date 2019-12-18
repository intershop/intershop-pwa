import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { OrdersAction, OrdersActionTypes } from 'ish-core/store/orders';

import { BasketAction, BasketActionTypes } from './basket.actions';

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
};

export function basketReducer(state = initialState, action: BasketAction | OrdersAction): BasketState {
  switch (action.type) {
    case BasketActionTypes.LoadBasket:
    case BasketActionTypes.AssignBasketAddress:
    case BasketActionTypes.UpdateBasketShippingMethod:
    case BasketActionTypes.UpdateBasket:
    case BasketActionTypes.AddProductToBasket:
    case BasketActionTypes.AddPromotionCodeToBasket:
    case BasketActionTypes.RemovePromotionCodeFromBasket:
    case BasketActionTypes.AddItemsToBasket:
    case BasketActionTypes.MergeBasket:
    case BasketActionTypes.ContinueCheckout:
    case BasketActionTypes.UpdateBasketItems:
    case BasketActionTypes.DeleteBasketItem:
    case BasketActionTypes.LoadBasketEligibleShippingMethods:
    case BasketActionTypes.LoadBasketEligiblePaymentMethods:
    case BasketActionTypes.SetBasketPayment:
    case BasketActionTypes.CreateBasketPayment:
    case BasketActionTypes.UpdateBasketPayment:
    case BasketActionTypes.DeleteBasketPayment: {
      return {
        ...state,
        loading: true,
      };
    }

    case BasketActionTypes.MergeBasketFail:
    case BasketActionTypes.LoadBasketFail:
    case BasketActionTypes.UpdateBasketFail:
    case BasketActionTypes.ContinueCheckoutFail:
    case BasketActionTypes.AddItemsToBasketFail:
    case BasketActionTypes.RemovePromotionCodeFromBasketFail:
    case BasketActionTypes.UpdateBasketItemsFail:
    case BasketActionTypes.DeleteBasketItemFail:
    case BasketActionTypes.LoadBasketEligibleShippingMethodsFail:
    case BasketActionTypes.LoadBasketEligiblePaymentMethodsFail:
    case BasketActionTypes.SetBasketPaymentFail:
    case BasketActionTypes.CreateBasketPaymentFail:
    case BasketActionTypes.UpdateBasketPaymentFail:
    case BasketActionTypes.DeleteBasketPaymentFail: {
      const { error } = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case BasketActionTypes.AddPromotionCodeToBasketFail: {
      const { error } = action.payload;

      return {
        ...state,
        promotionError: error,
        loading: false,
      };
    }

    case BasketActionTypes.AddPromotionCodeToBasketSuccess: {
      return {
        ...state,
        loading: false,
        promotionError: undefined,
      };
    }

    case BasketActionTypes.UpdateBasketItemsSuccess:
    case BasketActionTypes.DeleteBasketItemSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
        info: action.payload.info,
        validationResults: initialValidationResults,
      };
    }

    case BasketActionTypes.RemovePromotionCodeFromBasketSuccess:
    case BasketActionTypes.SetBasketPaymentSuccess:
    case BasketActionTypes.CreateBasketPaymentSuccess:
    case BasketActionTypes.UpdateBasketPaymentSuccess:
    case BasketActionTypes.DeleteBasketPaymentSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
        validationResults: initialValidationResults,
      };
    }

    case BasketActionTypes.AddItemsToBasketSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
        info: action.payload.info,
        lastTimeProductAdded: new Date().getTime(),
      };
    }

    case BasketActionTypes.MergeBasketSuccess:
    case BasketActionTypes.LoadBasketSuccess: {
      const basket = {
        ...action.payload.basket,
      };

      return {
        ...state,
        basket,
        loading: false,
        error: undefined,
      };
    }

    case BasketActionTypes.ContinueCheckoutSuccess:
    case BasketActionTypes.ContinueCheckoutWithIssues: {
      const validation = action.payload.basketValidation;
      const basket = validation && validation.results.adjusted && validation.basket ? validation.basket : state.basket;

      return {
        ...state,
        basket,
        loading: false,
        error: undefined,
        info: undefined,
        validationResults: validation && validation.results,
      };
    }

    case BasketActionTypes.LoadBasketEligibleShippingMethodsSuccess: {
      return {
        ...state,
        eligibleShippingMethods: action.payload.shippingMethods,
        loading: false,
        error: undefined,
      };
    }

    case BasketActionTypes.LoadBasketEligiblePaymentMethodsSuccess: {
      return {
        ...state,
        eligiblePaymentMethods: action.payload.paymentMethods,
        loading: false,
        error: undefined,
      };
    }

    case BasketActionTypes.ResetBasket:
    case OrdersActionTypes.CreateOrderSuccess: {
      return initialState;
    }

    case BasketActionTypes.ResetBasketErrors: {
      return {
        ...state,
        error: undefined,
        info: undefined,
        promotionError: undefined,
        validationResults: initialValidationResults,
      };
    }
  }
  return state;
}
