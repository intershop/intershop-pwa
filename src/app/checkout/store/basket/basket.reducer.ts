import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import { Basket } from '../../../models/basket/basket.model';
import { BasketAction, BasketActionTypes, LoadBasketFail, LoadBasketSuccess } from './basket.actions';

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
  action: BasketAction
): BasketState {
  switch (action.type) {

    case BasketActionTypes.LoadBasket: {
      return {
        ...state,
        loading: true
      };
    }

    case BasketActionTypes.LoadBasketFail: {
      return {
        ...state,
        error: (action as LoadBasketFail).payload,
        loading: false
      };
    }

    case BasketActionTypes.LoadBasketSuccess: {
      return {
        ...state,
        basket: (action as LoadBasketSuccess).payload,
        loading: false
      };

    }
  }
  return state;
}
