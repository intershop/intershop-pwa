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
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.LoadBasketFail(error);
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadBasketSuccess action', () => {
      it('should set basket and set loading to false', () => {
        const basket = {
          id: 'test'
        } as Basket;

        const action = new fromActions.LoadBasketSuccess(basket);
        const state = basketReducer(initialState, action);

        expect(state.basket).toEqual(basket);
        expect(state.loading).toEqual(false);
      });

    });
  });

  describe('AddItemToBasket actions', () => {

    describe('AddItemToBasket action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.AddItemToBasket({ sku: 'test', quanity: 1 });
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('AddItemToBasketFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.AddItemToBasketFail(error);
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('AddItemToBasketSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.AddItemToBasketSuccess({});
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });

    });
  });
});
