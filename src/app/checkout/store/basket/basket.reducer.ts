import { Basket } from '../../../models/basket/basket.model';
import { BasketAction, BasketActionTypes } from './basket.actions';

// ToDo: dummy draft code

export interface BasketState {
  basket: Basket;
  loading: boolean;
}

export const initialState: BasketState = {
  basket: {
    id: '123',
    lineItems: [{
      name: 'product 1',
      quantity: {
        value: 60
      }
    },
    {
      name: 'product 2',
      quantity: {
        value: 40
      }
    }],
    totals: {
      basketTotal: {
        value: 8189,
        currencyMnemonic: 'USD'
      }
    }
  } as Basket,
  loading: false
};

export const getBasket = (state: BasketState) => state.basket;

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
        loading: false
      };
    }

    case BasketActionTypes.LoadBasketSuccess: {
      return {
        ...state,
        loading: false
      };

    }
  }
  return state;
}
