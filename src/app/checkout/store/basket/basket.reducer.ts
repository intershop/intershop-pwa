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

    case BasketActionTypes.AddItemToBasket: {
      return {
        ...state,
        loading: true,
      };
    }

    case BasketActionTypes.AddItemToBasketFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case BasketActionTypes.AddItemToBasketSuccess: {
      return {
        ...state,
        loading: false,
      };
    }
  }
  return state;
}
