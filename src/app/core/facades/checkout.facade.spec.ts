import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { UserCostCenter } from 'ish-core/models/user-cost-center/user-cost-center.model';
import {
  getBasketEligibleShippingMethods,
  getBasketInvoiceAddress,
  getBasketLastTimeProductAdded,
  getBasketLoading,
  getCurrentBasket,
} from 'ish-core/store/customer/basket';
import { getUserCostCenters } from 'ish-core/store/customer/user';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { AccountFacade } from './account.facade';
import { CheckoutFacade } from './checkout.facade';

describe('Checkout Facade', () => {
  let store$: MockStore;
  let facade: CheckoutFacade;
  let accountFacadeMock: Partial<AccountFacade>;
  let isLoggedInSubject$: BehaviorSubject<boolean>;

  beforeEach(() => {
    isLoggedInSubject$ = new BehaviorSubject(false);
    accountFacadeMock = {
      isLoggedIn$: isLoggedInSubject$.asObservable(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useValue: accountFacadeMock },
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
            {
              selector: getBasketInvoiceAddress,
              value: undefined,
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
          [
            {
              "label": "1 Cost Center 1",
              "value": "1",
            },
            {
              "label": "3 Cost Center 3",
              "value": "3",
            },
          ]
        `);
        done();
      });
    });
  });

  describe('canUseBasketForRecurringOrder$', () => {
    const mockLineItems: LineItem[] = [
      { id: '1', quote: undefined } as LineItem,
      { id: '2', quote: undefined } as LineItem,
    ];

    const mockAddress: Address = { id: '123', line1: 'Test Street' } as unknown as Address;

    it('should return true when user is logged in, no invoice address', done => {
      isLoggedInSubject$.next(true);
      store$.overrideSelector(getBasketInvoiceAddress, undefined);
      store$.overrideSelector(getCurrentBasket, { ...BasketMockData.getBasket(), lineItems: mockLineItems });

      facade.canUseBasketForRecurringOrder$.subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should return true when user is not logged in, no invoice address', done => {
      isLoggedInSubject$.next(false);
      store$.overrideSelector(getBasketInvoiceAddress, undefined);
      store$.overrideSelector(getCurrentBasket, { ...BasketMockData.getBasket(), lineItems: mockLineItems });

      facade.canUseBasketForRecurringOrder$.subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should return false when user is not logged in and has invoice address (guest checkout)', done => {
      isLoggedInSubject$.next(false);
      store$.overrideSelector(getBasketInvoiceAddress, mockAddress);
      store$.overrideSelector(getCurrentBasket, { ...BasketMockData.getBasket(), lineItems: mockLineItems });

      facade.canUseBasketForRecurringOrder$.subscribe(result => {
        expect(result).toBeFalse();
        done();
      });
    });

    const mockLineItemsWithQuote: LineItem[] = [
      { id: '1', quote: undefined } as LineItem,
      { id: '2', quote: 'some-quote-id' } as LineItem,
    ];

    it('should return false when user is logged in but basket has quote items', done => {
      isLoggedInSubject$.next(true);
      store$.overrideSelector(getBasketInvoiceAddress, undefined);
      store$.overrideSelector(getCurrentBasket, { ...BasketMockData.getBasket(), lineItems: mockLineItemsWithQuote });

      facade.canUseBasketForRecurringOrder$.subscribe(result => {
        expect(result).toBeFalse();
        done();
      });
    });
  });
});
