import { HttpErrorResponse } from '@angular/common/http';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import * as fromActions from './basket.actions';
import { basketReducer, initialState } from './basket.reducer';

describe('Basket Reducer', () => {
  describe('LoadBasket actions', () => {
    describe('LoadCategory action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadBasket('test');
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
          id: 'test',
        } as Basket;

        const action = new fromActions.LoadBasketSuccess(basket);
        const state = basketReducer(initialState, action);

        expect(state.basket).toEqual(basket);
        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('LoadBasketItems actions', () => {
    describe('LoadBasketItems action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadBasketItems('test');
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('LoadBasketItemsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.LoadBasketItemsFail(error);
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadBasketItemsSuccess action', () => {
      it('should set basketItems and set loading to false', () => {
        const basket = {
          id: 'test',
        } as Basket;
        const basketItems = [] as BasketItem[];

        const basketAction = new fromActions.LoadBasketSuccess(basket);
        const basketItemsAction = new fromActions.LoadBasketItemsSuccess(basketItems);
        let state = basketReducer(initialState, basketAction);
        state = basketReducer(state, basketItemsAction);

        expect(state.basket.lineItems).toEqual(basketItems);
        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('AddItemsToBasket actions', () => {
    describe('AddProductToBasket action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.AddProductToBasket({ sku: 'test', quantity: 1 });
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('AddItemsToBasketFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.AddItemsToBasketFail(error);
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('AddItemsToBasketSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.AddItemsToBasketSuccess();
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('UpdateBasketItem actions', () => {
    describe('UpdateBasketItem action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.UpdateBasketItem({
          quantity: 2,
          itemId: 'test',
        });
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('UpdateBasketItemFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.UpdateBasketItemFail(error);
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateBasketItemSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.UpdateBasketItemSuccess();
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('DeleteBasketItem actions', () => {
    describe('DeleteBasketItem action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.DeleteBasketItem('test');
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('DeleteBasketItemFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.DeleteBasketItemFail(error);
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteBasketItemSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.DeleteBasketItemSuccess();
        const state = basketReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });
});
