import { HttpErrorResponse } from '@angular/common/http';
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
});
