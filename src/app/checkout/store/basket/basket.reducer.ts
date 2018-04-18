import { HttpErrorResponse } from '@angular/common/http';
import { Basket } from '../../../models/basket/basket.model';
import { BasketAction, BasketActionTypes } from './basket.actions';

export interface BasketState {
  basket: Basket;
  loading: boolean;
  error: HttpErrorResponse;
}

export const initialState: BasketState = {
  basket: null,
  loading: false,
  error: null,
};

export function basketReducer(state = initialState, action: BasketAction): BasketState {
  switch (action.type) {
    case BasketActionTypes.LoadBasket: {
      return {
        ...state,
        loading: true,
      };
    }

    case BasketActionTypes.LoadBasketFail: {
      const error = action.payload;

      return {
        ...state,
        error: error,
        loading: false,
      };
    }

    case BasketActionTypes.LoadBasketSuccess: {
      const basket = action.payload;

      return {
        ...state,
        basket,
        loading: false,
      };
    }

    case BasketActionTypes.LoadBasketItems: {
      return {
        ...state,
        loading: true,
      };
    }

    case BasketActionTypes.LoadBasketItemsFail: {
      const error = action.payload;

      return {
        ...state,
        error: error,
        loading: false,
      };
    }

    case BasketActionTypes.LoadBasketItemsSuccess: {
      const lineItems = action.payload;
      let updatedBasket;

      if (state.basket) {
        updatedBasket = {
          ...state.basket,
          lineItems: lineItems,
        };

        return {
          ...state,
          basket: updatedBasket,
          loading: false,
        };
      }

      return {
        ...state,
        loading: false,
      };
    }

    case BasketActionTypes.AddProductsToBasket: {
      return {
        ...state,
        loading: true,
      };
    }

    case BasketActionTypes.AddItemsToBasketFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case BasketActionTypes.AddItemsToBasketSuccess: {
      return {
        ...state,
        loading: false,
      };
    }
  }
  return state;
}
