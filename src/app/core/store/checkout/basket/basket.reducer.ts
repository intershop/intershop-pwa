import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

import { BasketAction, BasketActionTypes } from './basket.actions';

export interface BasketState {
  basket: Basket;
  eligibleShippingMethods: ShippingMethod[];
  eligiblePaymentMethods: PaymentMethod[];
  loading: boolean;
  error: HttpError; // add, update and delete errors
}

export const initialState: BasketState = {
  basket: undefined,
  eligibleShippingMethods: [],
  eligiblePaymentMethods: [],
  loading: false,
  error: undefined,
};

export function basketReducer(state = initialState, action: BasketAction): BasketState {
  switch (action.type) {
    case BasketActionTypes.LoadBasket:
    case BasketActionTypes.AssignBasketAddress:
    case BasketActionTypes.UpdateBasketShippingMethod:
    case BasketActionTypes.UpdateBasket:
    case BasketActionTypes.AddProductToBasket:
    case BasketActionTypes.AddQuoteToBasket:
    case BasketActionTypes.AddItemsToBasket:
    case BasketActionTypes.UpdateBasketItems:
    case BasketActionTypes.DeleteBasketItem:
    case BasketActionTypes.LoadBasketEligibleShippingMethods:
    case BasketActionTypes.LoadBasketEligiblePaymentMethods:
    case BasketActionTypes.SetBasketPayment:
    case BasketActionTypes.CreateBasketPayment:
    case BasketActionTypes.UpdateBasketPayment:
    case BasketActionTypes.DeleteBasketPayment:
    case BasketActionTypes.CreateOrder: {
      return {
        ...state,
        loading: true,
      };
    }

    case BasketActionTypes.LoadBasketFail:
    case BasketActionTypes.CreateOrderFail:
    case BasketActionTypes.UpdateBasketFail:
    case BasketActionTypes.AddItemsToBasketFail:
    case BasketActionTypes.AddQuoteToBasketFail:
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

    case BasketActionTypes.AddItemsToBasketSuccess:
    case BasketActionTypes.AddQuoteToBasketSuccess:
    case BasketActionTypes.UpdateBasketItemsSuccess:
    case BasketActionTypes.DeleteBasketItemSuccess:
    case BasketActionTypes.SetBasketPaymentSuccess:
    case BasketActionTypes.CreateBasketPaymentSuccess:
    case BasketActionTypes.UpdateBasketPaymentSuccess:
    case BasketActionTypes.DeleteBasketPaymentSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
      };
    }

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
    case BasketActionTypes.CreateOrderSuccess: {
      return initialState;
    }
  }
  return state;
}
