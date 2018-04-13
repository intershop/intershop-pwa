import { HttpErrorResponse } from '@angular/common/http';
import { Basket } from '../../../models/basket/basket.model';
import * as basketActions from './basket.actions';

export interface BasketState {
  basket: Basket;
  loading: boolean;
  error: HttpErrorResponse;
}

export const initialState: BasketState = {
  basket: null,
  loading: false,
  error: null
};

export function basketReducer(
  state = initialState,
  action: basketActions.BasketAction
): BasketState {
  switch (action.type) {

    case basketActions.BasketActionTypes.LoadBasket: {
      return {
        ...state,
        loading: true
      };
    }

    case basketActions.BasketActionTypes.LoadBasketFail: {
      const error = action.payload;

      return {
        ...state,
        error: error,
        loading: false
      };
    }

    case basketActions.BasketActionTypes.LoadBasketSuccess: {
      const basket = action.payload;

      return {
        ...state,
        basket,
        loading: false
      };
    }

    case basketActions.BasketActionTypes.AddItemToBasket: {
      return {
        ...state,
        loading: true
      };
    }

    case basketActions.BasketActionTypes.AddItemToBasketFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false
      };
    }

    case basketActions.BasketActionTypes.AddItemToBasketSuccess: {
      return {
        ...state,
        loading: false
      };
    }
  }
  return state;
}
