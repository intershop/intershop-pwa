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
  error: undefined
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
      return {
        ...state,
        error: (action as basketActions.LoadBasketFail).payload,
        loading: false
      };
    }

    case basketActions.BasketActionTypes.LoadBasketSuccess: {
      return {
        ...state,
        basket: (action as basketActions.LoadBasketSuccess).payload,
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
      return {
        ...state,
        error: (action as basketActions.AddItemToBasketFail).payload,
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
