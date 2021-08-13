import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import {
  getBasketEligibleShippingMethods,
  getBasketLastTimeProductAdded,
  getBasketLoading,
  getCurrentBasket,
} from 'ish-core/store/customer/basket';
import { getUserCostCenters } from 'ish-core/store/customer/user';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CheckoutFacade } from './checkout.facade';

describe('Checkout Facade', () => {
  let store$: MockStore;
  let facade: CheckoutFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: getCurrentBasket,
              value: BasketMockData.getBasket(),
            },
            {
              selector: getBasketLastTimeProductAdded,
              value: undefined,
            },
            {
              selector: getBasketLoading,
              value: false,
            },
          ],
        }),
      ],
    });

    store$ = TestBed.inject(MockStore);
    facade = TestBed.inject(CheckoutFacade);
  });

  describe('getValidShippingMethod$()', () => {
    beforeEach(() => {
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

  describe('Cost Centers', () => {
    const mockCostCenters: CostCenter[] = [
      {
        id: '1',
        name: 'Cost Center 1',
        roles: ['Buyer', 'Tester'],
      },
      {
        id: '2',
        name: 'Cost Center 2',
        roles: ['Tester'],
      },
      {
        id: '3',
        name: 'Cost Center 3',
        roles: ['Buyer'],
      },
    ];

    beforeEach(() => {
      store$.overrideSelector(getUserCostCenters, mockCostCenters);
    });

    it('should retrun select box options when eligibleCostCenterOptions is called', done => {
      const expectedSelectboxOptions = [
        { label: mockCostCenters[0].name, value: mockCostCenters[0].id },
        { label: mockCostCenters[2].name, value: mockCostCenters[2].id },
      ];

      facade.eligibleCostCenterOptions$('Buyer').subscribe(costCenterOptions => {
        expect(costCenterOptions).toEqual(expectedSelectboxOptions);
        done();
      });
    });
  });
});
