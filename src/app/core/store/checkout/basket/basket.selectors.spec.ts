import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadProductSuccess } from '../../shopping/products';
import { shoppingReducers } from '../../shopping/shopping-store.module';
import { checkoutReducers } from '../checkout-store.module';

import {
  LoadBasket,
  LoadBasketEligiblePaymentMethods,
  LoadBasketEligiblePaymentMethodsFail,
  LoadBasketEligiblePaymentMethodsSuccess,
  LoadBasketEligibleShippingMethods,
  LoadBasketEligibleShippingMethodsFail,
  LoadBasketEligibleShippingMethodsSuccess,
  LoadBasketFail,
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
      store$.dispatch(
        new LoadProductSuccess({
          product: { sku: 'sku', completenessLevel: ProductHelper.maxCompletenessLevel } as Product,
        })
      );
    });

    it('should set the state to loading', () => {
      expect(getBasketLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set basket state', () => {
      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'test',
            lineItems: [{ id: 'test', productSKU: 'sku', quantity: { value: 5 } } as LineItem],
            payment: { paymentInstrument: { id: 'ISH_INVOICE' } },
          } as BasketView,
        })
      );

      expect(getBasketLoading(store$.state)).toBeFalse();

      const currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.id).toEqual('test');
      expect(currentBasket.lineItems).toHaveLength(1);
      expect(currentBasket.lineItems[0].id).toEqual('test');
      expect(currentBasket.lineItems[0].product).toHaveProperty('sku', 'sku');
      expect(currentBasket.itemsCount).toEqual(5);
      expect(currentBasket.payment.paymentInstrument.id).toEqual('ISH_INVOICE');
    });

    it('should change the product of the basket line item if the product is changing', () => {
      store$.dispatch(
        new LoadBasketSuccess({
          basket: { id: 'test', lineItems: [{ id: 'test', productSKU: 'sku' } as LineItem] } as Basket,
        })
      );
      let currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.lineItems[0].product).toHaveProperty('sku', 'sku');

      store$.dispatch(
        new LoadProductSuccess({
          product: { sku: 'sku', name: 'new name', completenessLevel: ProductHelper.maxCompletenessLevel } as Product,
        })
      );

      currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.lineItems[0].product).toHaveProperty('name', 'new name');
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadBasketFail({ error: { message: 'invalid' } as HttpError }));
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
        store$.dispatch(
          new LoadBasketEligibleShippingMethodsSuccess({ shippingMethods: [BasketMockData.getShippingMethod()] })
        );
      });

      it('should set loading to false', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligibleShippingMethods(store$.state)).toEqual([BasketMockData.getShippingMethod()]);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadBasketEligibleShippingMethodsFail({ error: { message: 'error' } as HttpError }));
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
        store$.dispatch(
          new LoadBasketEligiblePaymentMethodsSuccess({ paymentMethods: [BasketMockData.getPaymentMethod()] })
        );
      });

      it('should set loading to false', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligiblePaymentMethods(store$.state)).toEqual([BasketMockData.getPaymentMethod()]);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadBasketEligiblePaymentMethodsFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded payment methods on error', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligiblePaymentMethods(store$.state)).toBeEmpty();
        expect(getBasketError(store$.state)).toEqual({ message: 'error' });
      });
    });
  });
});
