import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket, BasketView } from '../../../models/basket/basket.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Payment } from '../../../models/payment/payment.model';
import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { checkoutReducers } from '../checkout.system';

import {
  LoadBasket,
  LoadBasketEligiblePaymentMethods,
  LoadBasketEligiblePaymentMethodsFail,
  LoadBasketEligiblePaymentMethodsSuccess,
  LoadBasketEligibleShippingMethods,
  LoadBasketEligibleShippingMethodsFail,
  LoadBasketEligibleShippingMethodsSuccess,
  LoadBasketFail,
  LoadBasketItemsSuccess,
  LoadBasketPaymentsSuccess,
  LoadBasketSuccess,
} from './basket.actions';
import {
  getBasketEligiblePaymentMethods,
  getBasketEligibleShippingMethods,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from './basket.selectors';

describe('Basket Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        checkout: combineReducers(checkoutReducers),
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should be present if no basket is present', () => {
      expect(getCurrentBasket(store$.state)).toBeUndefined();
    });

    it('should not select any shipping methods if it is in initial state', () => {
      expect(getBasketEligibleShippingMethods(store$.state)).toBeEmpty();
      expect(getBasketLoading(store$.state)).toBeFalse();
      expect(getBasketError(store$.state)).toBeUndefined();
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
      store$.dispatch(new LoadBasketSuccess({ id: 'test' } as BasketView));
      store$.dispatch(
        new LoadBasketItemsSuccess([{ id: 'test', productSKU: 'sku', quantity: { value: 5 } } as BasketItem])
      );
      store$.dispatch(new LoadBasketPaymentsSuccess([{ name: 'p_test' } as Payment]));
      expect(getBasketLoading(store$.state)).toBeFalse();

      const currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.id).toEqual('test');
      expect(currentBasket.lineItems).toHaveLength(1);
      expect(currentBasket.lineItems[0].id).toEqual('test');
      expect(currentBasket.lineItems[0].product).toEqual({ sku: 'sku' });
      expect(currentBasket.itemsCount).toEqual(5);
      expect(currentBasket.payment.name).toEqual('p_test');
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
      store$.dispatch(new LoadBasketFail({ message: 'invalid' } as HttpError));
      expect(getBasketLoading(store$.state)).toBeFalse();
      expect(getCurrentBasket(store$.state)).toBeUndefined();
      expect(getBasketError(store$.state)).toEqual({ message: 'invalid' });
    });
  });

  describe('loading eligible shipping methods', () => {
    beforeEach(() => {
      store$.dispatch(new LoadBasketEligibleShippingMethods());
    });

    it('should set the state to loading', () => {
      expect(getBasketLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadBasketEligibleShippingMethodsSuccess([BasketMockData.getShippingMethod()]));
      });

      it('should set loading to false', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligibleShippingMethods(store$.state)).toEqual([BasketMockData.getShippingMethod()]);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadBasketEligibleShippingMethodsFail({ message: 'error' } as HttpError));
      });

      it('should not have loaded shipping methods on error', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligibleShippingMethods(store$.state)).toBeEmpty();
        expect(getBasketError(store$.state)).toEqual({ message: 'error' });
      });
    });
  });

  describe('loading eligible payment methods', () => {
    beforeEach(() => {
      store$.dispatch(new LoadBasketEligiblePaymentMethods());
    });

    it('should set the state to loading', () => {
      expect(getBasketLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadBasketEligiblePaymentMethodsSuccess([BasketMockData.getPaymentMethod()]));
      });

      it('should set loading to false', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligiblePaymentMethods(store$.state)).toEqual([BasketMockData.getPaymentMethod()]);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadBasketEligiblePaymentMethodsFail({ message: 'error' } as HttpError));
      });

      it('should not have loaded payment methods on error', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligiblePaymentMethods(store$.state)).toBeEmpty();
        expect(getBasketError(store$.state)).toEqual({ message: 'error' });
      });
    });
  });
});
