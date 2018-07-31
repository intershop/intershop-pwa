import { HttpErrorResponse } from '@angular/common/http';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { BasketAction, BasketActionTypes } from './basket.actions';

export interface BasketState {
  basket: Basket;
  lineItems: BasketItem[];
  payments: PaymentMethod[];
  loading: boolean;
  error: HttpErrorResponse;
}

export const initialState: BasketState = {
  basket: undefined,
  lineItems: [],
  payments: [],
  loading: false,
  error: undefined,
};

export function basketReducer(state = initialState, action: BasketAction): BasketState {
  switch (action.type) {
    case BasketActionTypes.LoadBasket:
    case BasketActionTypes.UpdateBasketInvoiceAddress:
    case BasketActionTypes.UpdateBasketShippingAddress:
    case BasketActionTypes.UpdateBasket:
    case BasketActionTypes.LoadBasketItems:
    case BasketActionTypes.AddProductToBasket:
    case BasketActionTypes.AddQuoteToBasket:
    case BasketActionTypes.AddItemsToBasket:
    case BasketActionTypes.UpdateBasketItems:
    case BasketActionTypes.DeleteBasketItem:
    case BasketActionTypes.LoadBasketPayments:
    case BasketActionTypes.SetBasketPayment:
    case BasketActionTypes.CreateOrder: {
      return {
        ...state,
        loading: true,
      };
    }

    case BasketActionTypes.LoadBasketFail:
    case BasketActionTypes.UpdateBasketFail:
    case BasketActionTypes.LoadBasketItemsFail:
    case BasketActionTypes.AddItemsToBasketFail:
    case BasketActionTypes.AddQuoteToBasketFail:
    case BasketActionTypes.UpdateBasketItemsFail:
    case BasketActionTypes.DeleteBasketItemFail:
    case BasketActionTypes.LoadBasketPaymentsFail:
    case BasketActionTypes.SetBasketPaymentFail:
    case BasketActionTypes.CreateOrderFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case BasketActionTypes.UpdateBasketSuccess:
    case BasketActionTypes.AddItemsToBasketSuccess:
    case BasketActionTypes.AddQuoteToBasketSuccess:
    case BasketActionTypes.UpdateBasketItemsSuccess:
    case BasketActionTypes.DeleteBasketItemSuccess:
    case BasketActionTypes.SetBasketPaymentSuccess: {
      return {
        ...state,
        loading: false,
      };
    }

    case BasketActionTypes.LoadBasketSuccess: {
      const basket = {
        ...action.payload,
        lineItems: undefined,
      };

      return {
        ...state,
        basket,
        loading: false,
      };
    }

    case BasketActionTypes.LoadBasketItemsSuccess: {
      const lineItems = action.payload;
      return {
        ...state,
        lineItems,
        loading: false,
      };
    }

    case BasketActionTypes.LoadBasketPaymentsSuccess: {
      const payments = action.payload;

      return {
        ...state,
        payments,
        loading: false,
      };
    }

    case BasketActionTypes.ResetBasket:
    case BasketActionTypes.CreateOrderSuccess: {
      return initialState;
    }
  }
  return state;
}
