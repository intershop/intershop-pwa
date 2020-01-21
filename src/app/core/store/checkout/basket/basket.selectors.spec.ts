import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidation } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadProductSuccess } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import {
  AddItemsToBasketSuccess,
  AddPromotionCodeToBasketFail,
  ContinueCheckoutSuccess,
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
  getBasketInfo,
  getBasketLastTimeProductAdded,
  getBasketLoading,
  getBasketPromotionError,
  getBasketValidationResults,
  getCurrentBasket,
  getCurrentBasketId,
} from './basket.selectors';

describe('Basket Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          ...coreReducers,
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should be present if no basket is present', () => {
      expect(getCurrentBasket(store$.state)).toBeUndefined();
      expect(getCurrentBasketId(store$.state)).toBeUndefined();
    });

    it('should not select any shipping methods if it is in initial state', () => {
      expect(getBasketEligibleShippingMethods(store$.state)).toBeUndefined();
    });

    it('should not select any payment methods if it is in initial state', () => {
      expect(getBasketEligiblePaymentMethods(store$.state)).toBeUndefined();
    });

    it('should not select loading, error and lastTimeProductAdded if it is in initial state', () => {
      expect(getBasketLoading(store$.state)).toBeFalse();
      expect(getBasketError(store$.state)).toBeUndefined();
      expect(getBasketPromotionError(store$.state)).toBeUndefined();
      expect(getBasketLastTimeProductAdded(store$.state)).toBeUndefined();
    });
  });

  describe('loading a basket', () => {
    beforeEach(() => {
      store$.dispatch(new LoadBasket());
      store$.dispatch(
        new LoadProductSuccess({
          product: { sku: 'sku', completenessLevel: ProductCompletenessLevel.Detail } as Product,
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
      expect(currentBasket.payment.paymentInstrument.id).toEqual('ISH_INVOICE');

      expect(getCurrentBasketId(store$.state)).toEqual('test');
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
          product: { sku: 'sku', name: 'new name', completenessLevel: ProductCompletenessLevel.Detail } as Product,
        })
      );

      currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.lineItems[0].product).toHaveProperty('name', 'new name');
    });

    it('should set validation results to the lineitem if basket is not valid', () => {
      store$.dispatch(
        new LoadBasketSuccess({
          basket: { id: 'test', lineItems: [{ id: 'test', productSKU: 'sku' } as LineItem] } as Basket,
        })
      );
      store$.dispatch(
        new ContinueCheckoutSuccess({
          targetRoute: '/checkout/address',
          basketValidation: {
            results: {
              valid: false,
              errors: [
                { code: 'basket.validation.4711', message: 'test error message', parameters: { lineItemId: 'test' } },
              ],
            },
          } as BasketValidation,
        })
      );

      const currentBasket = getCurrentBasket(store$.state);
      expect(currentBasket.lineItems[0].validationError.code).toEqual('basket.validation.4711');
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadBasketFail({ error: { message: 'invalid' } as HttpError }));
      expect(getBasketLoading(store$.state)).toBeFalse();
      expect(getCurrentBasket(store$.state)).toBeUndefined();
      expect(getCurrentBasketId(store$.state)).toBeUndefined();
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
        expect(getBasketEligibleShippingMethods(store$.state)).toBeUndefined();
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

      it('should set load data when user is logged in', () => {
        store$.dispatch(new LoginUserSuccess({ customer: {} as Customer }));
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligiblePaymentMethods(store$.state)).toEqual([BasketMockData.getPaymentMethod()]);
      });

      it('should set load data and set saveForLater to false if user is logged out', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligiblePaymentMethods(store$.state)).toEqual([
          { ...BasketMockData.getPaymentMethod(), saveAllowed: false },
        ]);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadBasketEligiblePaymentMethodsFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded payment methods on error', () => {
        expect(getBasketLoading(store$.state)).toBeFalse();
        expect(getBasketEligiblePaymentMethods(store$.state)).toBeUndefined();
        expect(getBasketError(store$.state)).toEqual({ message: 'error' });
      });
    });
  });

  describe('loading last time and info when a product has been added to basket', () => {
    beforeEach(() => {
      store$.dispatch(new AddItemsToBasketSuccess({ info: [{ message: 'info' } as BasketInfo] }));
    });

    it('should get the last time when a product was added', () => {
      const firstTimeAdded = new Date(getBasketLastTimeProductAdded(store$.state));

      expect(firstTimeAdded).toBeDate();
      store$.dispatch(new AddItemsToBasketSuccess({ info: undefined }));
      expect(getBasketLastTimeProductAdded(store$.state)).not.toEqual(firstTimeAdded);
    });

    it('should get the info when a product was added', () => {
      expect(getBasketInfo(store$.state)).toHaveLength(1);
    });
  });

  describe('loading promotion error after adding a wrong promotion code', () => {
    beforeEach(() => {
      store$.dispatch(new AddPromotionCodeToBasketFail({ error: { message: 'error' } as HttpError }));
    });

    it('should reporting the failure in case of an error', () => {
      expect(getBasketPromotionError(store$.state)).toEqual({ message: 'error' });
    });
  });

  describe('loading validation result error after the basket has been validated', () => {
    const basketValidation: BasketValidation = {
      basket: BasketMockData.getBasket(),
      results: {
        valid: false,
        adjusted: false,
        errors: [
          {
            message: 'error occured',
            code: '4711',
            parameters: {
              lineItemId: '4712',
            },
          },
        ],
      },
    };
    beforeEach(() => {
      store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));
      store$.dispatch(new ContinueCheckoutSuccess({ targetRoute: '/checkout/address', basketValidation }));
    });

    it('should reporting the validation results when called', () => {
      expect(getBasketValidationResults(store$.state).valid).toBeFalse();
      expect(getBasketValidationResults(store$.state).errors[0].message).toEqual('error occured');
      expect(getBasketValidationResults(store$.state).errors[0].lineItem.id).toEqual('4712');
    });
  });
});
