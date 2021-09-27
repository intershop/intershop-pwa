import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { UserCostCenter } from 'ish-core/models/user-cost-center/user-cost-center.model';
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
    const mockCostCenters: UserCostCenter[] = [
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
      facade.eligibleCostCenterSelectOptions$('Buyer').subscribe(costCenterOptions => {
        expect(costCenterOptions).toMatchInlineSnapshot(`
          Array [
            Object {
              "label": "1 Cost Center 1",
              "value": "1",
            },
            Object {
              "label": "3 Cost Center 3",
              "value": "3",
            },
          ]
        `);
        done();
      });
    });
  });
});
