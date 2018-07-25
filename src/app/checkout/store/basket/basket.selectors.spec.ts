import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { LogEffects } from '../../../utils/dev/log.effects';
import { checkoutReducers } from '../checkout.system';
import {
  LoadBasket,
  LoadBasketFail,
  LoadBasketItemsSuccess,
  LoadBasketPaymentsSuccess,
  LoadBasketSuccess,
} from './basket.actions';
import { getBasketError, getBasketLoading, getCurrentBasket } from './basket.selectors';

describe('Basket Selectors', () => {
  let store$: LogEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        }),
        EffectsModule.forRoot([LogEffects]),
      ],
    });

    store$ = TestBed.get(LogEffects);
  });

  describe('with empty state', () => {
    it('should be present if no basket is present', () => {
      expect(getCurrentBasket(store$.state)).toBeUndefined();
    });
  });

  describe('loading a basket', () => {
    beforeEach(() => {
      store$.dispatch(new LoadBasket());
      store$.dispatch(new LoadProductSuccess({ sku: 'sku' } as Product));
    });

    it('should set the state to loading', () => {
      expect(getBasketLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set basket state', () => {
      store$.dispatch(new LoadBasketSuccess({ id: 'test' } as Basket));
      store$.dispatch(new LoadBasketItemsSuccess([{ id: 'test', productSKU: 'sku' } as BasketItem]));
      store$.dispatch(new LoadBasketPaymentsSuccess([{ id: 'p_test' } as PaymentMethod]));
      expect(getBasketLoading(store$.state)).toBeFalse();

      const currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.id).toEqual('test');
      expect(currentBasket.lineItems).toHaveLength(1);
      expect(currentBasket.lineItems[0].id).toEqual('test');
      expect(currentBasket.lineItems[0].product).toEqual({ sku: 'sku' });
      expect(currentBasket.paymentMethod.id).toEqual('p_test');
    });

    it('should change the product of the basket line item if the product is changing', () => {
      store$.dispatch(new LoadBasketSuccess({ id: 'test' } as Basket));
      store$.dispatch(new LoadBasketItemsSuccess([{ id: 'test', productSKU: 'sku' } as BasketItem]));

      let currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.lineItems[0].product).toEqual({ sku: 'sku' });

      store$.dispatch(new LoadProductSuccess({ sku: 'sku', name: 'new name' } as Product));

      currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.lineItems[0].product).toEqual({ sku: 'sku', name: 'new name' });
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadBasketFail({ message: 'invalid' } as HttpErrorResponse));
      expect(getBasketLoading(store$.state)).toBeFalse();
      expect(getCurrentBasket(store$.state)).toBeUndefined();
      expect(getBasketError(store$.state)).toEqual({ message: 'invalid' });
    });
  });
});
