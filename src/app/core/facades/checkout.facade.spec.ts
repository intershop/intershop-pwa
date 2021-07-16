import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { getBasketEligibleShippingMethods, getCurrentBasket } from 'ish-core/store/customer/basket';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CheckoutFacade } from './checkout.facade';

describe('Checkout Facade', () => {
  let store$: MockStore;
  let facade: CheckoutFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store$ = TestBed.inject(MockStore);
    facade = TestBed.inject(CheckoutFacade);
  });

  describe('getValidShippingMethod$()', () => {
    beforeEach(() => {
      store$.overrideSelector(getCurrentBasket, BasketMockData.getBasket());
      store$.overrideSelector(getBasketEligibleShippingMethods, [BasketMockData.getBasket().commonShippingMethod]);
    });

    it('should return commonShippingMethod if it is valid', done => {
      facade.getValidShippingMethod$().subscribe(shippingMethod => {
        expect(shippingMethod).toEqual(BasketMockData.getBasket().commonShippingMethod.id);
        done();
      });
    });
    it('should return first shippingMethod if basket has no valid shippingMethod', done => {
      store$.overrideSelector(getBasketEligibleShippingMethods, [
        { id: 'first' },
        { id: 'second' },
      ] as ShippingMethod[]);
      facade.getValidShippingMethod$().subscribe(shippingMethod => {
        expect(shippingMethod).toEqual('first');
        done();
      });
    });
  });
});
