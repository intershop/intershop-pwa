import { HttpErrorResponse } from '@angular/common/http';
import { Basket } from '../../../models/basket/basket.model';
import * as fromActions from './basket.actions';
import { basketReducer, initialState } from './basket.reducer';

describe('Basket Reducer', () => {
  describe('LoadBasket actions', () => {
    describe('LoadBasket action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadBasket('123');
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('LoadBasketFail action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.LoadBasketFail({} as HttpErrorResponse);
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });

    describe('LoadBasketSuccess action', () => {
      let basket: Basket;

      beforeEach(() => {
        basket = {
          id: '584'
        } as Basket;
      });

      it('should set loading to false', () => {
        const action = new fromActions.LoadBasketSuccess(basket);
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });
});
