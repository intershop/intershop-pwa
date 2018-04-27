import { HttpErrorResponse } from '@angular/common/http';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import * as fromActions from './basket.actions';

describe('Basket Actions', () => {
  describe('Load Basket Actions', () => {
    it('should create new action for LoadBasket', () => {
      const payload = '123';
      const action = new fromActions.LoadBasket(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasket,
        payload,
      });
    });

    it('should create new action for LoadBasketFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadBasketFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketFail,
        payload,
      });
    });

    it('should create new action for LoadBasketSuccess', () => {
      const payload = { id: '123' } as Basket;
      const action = new fromActions.LoadBasketSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketSuccess,
        payload,
      });
    });
  });

  describe('Load Basket Items Actions', () => {
    it('should create new action for LoadBasketItems', () => {
      const payload = '123';
      const action = new fromActions.LoadBasketItems(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketItems,
        payload,
      });
    });

    it('should create new action for LoadBasketItemsFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadBasketItemsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketItemsFail,
        payload,
      });
    });

    it('should create new action for LoadBasketItemsSuccess', () => {
      const payload = [] as BasketItem[];
      const action = new fromActions.LoadBasketItemsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketItemsSuccess,
        payload,
      });
    });
  });

  describe('Add Items To Basket Actions', () => {
    it('should create new action for AddProductToBasket', () => {
      const payload = { sku: 'test', quantity: 1 };
      const action = new fromActions.AddProductToBasket(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddProductToBasket,
        payload,
      });
    });

    it('should create new action for AddItemsToBasketFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.AddItemsToBasketFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddItemsToBasketFail,
        payload,
      });
    });

    it('should create new action for AddItemsToBasketSuccess', () => {
      const action = new fromActions.AddItemsToBasketSuccess();

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddItemsToBasketSuccess,
      });
    });
  });
});
