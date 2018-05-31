import { HttpErrorResponse } from '@angular/common/http';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { BasketAction, BasketActionTypes } from './basket.actions';

export interface BasketState {
  basket: Basket;
  lineItems: BasketItem[];
  loading: boolean;
  error: HttpErrorResponse;
}

export const initialState: BasketState = {
  basket: null,
  lineItems: [],
  loading: false,
  error: null,
};

export function basketReducer(state = initialState, action: BasketAction): BasketState {
  switch (action.type) {
    case BasketActionTypes.LoadBasket:
    case BasketActionTypes.UpdateBasketInvoiceAddress:
    case BasketActionTypes.UpdateBasketShippingAddress:
    case BasketActionTypes.UpdateBasket:
    case BasketActionTypes.LoadBasketItems:
    case BasketActionTypes.AddProductToBasket:
    case BasketActionTypes.AddItemsToBasket:
    case BasketActionTypes.UpdateBasketItems:
    case BasketActionTypes.DeleteBasketItem: {
      return {
        ...state,
        loading: true,
      };
    }

    case BasketActionTypes.LoadBasketFail:
    case BasketActionTypes.UpdateBasketFail:
    case BasketActionTypes.LoadBasketItemsFail:
    case BasketActionTypes.AddItemsToBasketFail:
    case BasketActionTypes.UpdateBasketItemsFail:
    case BasketActionTypes.DeleteBasketItemFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case BasketActionTypes.UpdateBasketSuccess:
    case BasketActionTypes.AddItemsToBasketSuccess:
    case BasketActionTypes.UpdateBasketItemsSuccess:
    case BasketActionTypes.DeleteBasketItemSuccess: {
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

    case BasketActionTypes.ResetBasket: {
      return initialState;
    }
  }
  return state;
}
