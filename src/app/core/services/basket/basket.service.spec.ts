import { HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { LoadBasketSuccess } from 'ish-core/store/checkout/basket/basket.actions';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BasketItemUpdateType, BasketService } from './basket.service';

describe('Basket Service', () => {
  let basketService: BasketService;
  let apiService: ApiService;
  let store$: Store;

  const basketMockData = {
    data: {
      id: 'test',
      calculationState: 'UNCALCULATED',
      buckets: [
        {
          lineItems: [],
          shippingMethod: {},
          shipToAddress: {},
        },
      ],
      payment: {
        name: 'testPayment',
        id: 'paymentId',
      },
      totals: {},
    },
  };

  const basketBaseData: BasketBaseData = {
    id: 'basket_1234',
    calculated: true,
    invoiceToAddress: 'urn_invoiceToAddress_123',
    commonShipToAddress: 'urn_commonShipToAddress_123',
    commonShippingMethod: 'shipping_method_123',
    customer: 'Heimroth',
    lineItems: ['YikKAE8BKC0AAAFrIW8IyLLD'],
    totals: {
      grandTotal: {
        gross: {
          value: 141796.98,
          currency: 'USD',
        },
        net: {
          value: 141796.98,
          currency: 'USD',
        },
        tax: {
          value: 543.65,
          currency: 'USD',
        },
      },
      itemTotal: {
        gross: {
          value: 141796.98,
          currency: 'USD',
        },
        net: {
          value: 141796.98,
          currency: 'USD',
        },
      },
    } as BasketTotalData,
    discounts: {
      valueBasedDiscounts: ['discount_1'],
    },
    surcharges: {
      itemSurcharges: [
        {
          name: 'item_surcharge',
          amount: {
            gross: {
              value: 654.56,
              currency: 'USD',
            },
            net: {
              value: 647.56,
              currency: 'USD',
            },
          },
          description: 'Surcharge for battery deposit',
        },
      ],
      bucketSurcharges: [
        {
          name: 'bucket_surcharge',
          amount: {
            gross: {
              value: 64.56,
              currency: 'USD',
            },
            net: {
              value: 61.86,
              currency: 'USD',
            },
          },
          description: 'Bucket Surcharge for hazardous material',
        },
      ],
    },
  };

  const lineItemData = {
    id: 'test',
    quantity: {
      type: 'Quantity',
      unit: '',
      value: 1,
    },
  };

  const itemMockData = {
    sku: 'test',
    quantity: 10,
    unit: 'pcs.',
  };

  const sourceBasket = '012345';

  const basketMergeResponseData = {
    data: {
      sourceBasket,
      targetBasket: '345678abc',
    },
    included: {
      targetBasket: {
        '345678abc': {
          id: 'test',
          calculationState: 'UNCALCULATED',
          buckets: [
            {
              lineItems: [],
              shippingMethod: {},
              shipToAddress: {},
            },
          ],
          payment: {
            name: 'testPayment',
            id: 'paymentId',
          },
          totals: {},
        },
      },
    },
  };

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.icmServerURL).thenReturn('BASE');

    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            ...coreReducers,
            checkout: combineReducers(checkoutReducers),
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      providers: [BasketService, { provide: ApiService, useFactory: () => instance(apiService) }],
    });

    basketService = TestBed.inject(BasketService);
    store$ = TestBed.inject(Store);
  });

  it("should get basket data when 'getBasket' is called and a basket exists", done => {
    when(apiService.get(`baskets`, anything())).thenReturn(of({ data: [basketBaseData], links: {} }));
    when(apiService.get(`baskets/current`, anything())).thenReturn(of(basketMockData));

    when(apiService.post(`baskets`, anything(), anything())).thenReturn(of(basketMockData));

    basketService.getBasket().subscribe(data => {
      expect(data.id).toEqual(basketMockData.data.id);
      verify(apiService.post(`baskets`, anything())).never();
      verify(apiService.get(`baskets/current`, anything())).once();
      done();
    });
  });

  it("should create basket data when 'getBasket' is called and no basket exists", done => {
    when(apiService.post(`baskets`, anything(), anything())).thenReturn(of(basketMockData));
    when(apiService.get(`baskets`, anything())).thenReturn(of({ data: [] }));

    basketService.getBasket().subscribe(data => {
      expect(data.id).toEqual(basketMockData.data.id);
      verify(apiService.post(`baskets`, anything(), anything())).once();
      done();
    });
  });

  it('should load a basket by token when requested and successful', done => {
    when(apiService.get(anything(), anything())).thenReturn(of(basketMockData));

    basketService.getBasketByToken('dummy').subscribe(data => {
      verify(apiService.get(anything(), anything())).once();
      const [path, options] = capture<string, { headers: HttpHeaders }>(apiService.get).last();
      expect(path).toEqual('baskets/current');
      expect(options.headers.get(ApiService.TOKEN_HEADER_KEY)).toEqual('dummy');
      expect(data).toHaveProperty('id', 'test');
      done();
    });
  });

  it('should not throw errors when getting a basket by token is unsuccessful', done => {
    when(apiService.get(anything(), anything())).thenReturn(throwError(new Error()));

    basketService.getBasketByToken('dummy').subscribe(fail, fail, done);
  });

  it("should create a basket data when 'createBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of(basketMockData));

    basketService.createBasket().subscribe(data => {
      expect(data.id).toEqual(basketMockData.data.id);
      verify(apiService.post(`baskets`, anything(), anything())).once();
      done();
    });
  });

  it("should update data to basket of a specific basket when 'updateBasket' is called", done => {
    when(apiService.patch(anything(), anything(), anything())).thenReturn(of(basketMockData));
    const payload = { invoiceToAddress: '123456' };

    basketService.updateBasket(payload).subscribe(() => {
      verify(apiService.patch(`baskets/current`, payload, anything())).once();
      done();
    });
  });

  it("should validate the basket when 'validateBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of(undefined));
    when(apiService.get(`baskets`, anything())).thenReturn(of({ data: [basketBaseData], links: {} }));
    when(apiService.get(`baskets/current`, anything())).thenReturn(of(basketMockData));

    basketService.validateBasket().subscribe(() => {
      verify(apiService.post(`baskets/current/validations`, anything(), anything())).once();
      done();
    });
  });

  it("should get active baskets of the current user when 'getBaskets' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({}));

    basketService.getBaskets().subscribe(() => {
      verify(apiService.get(`baskets`, anything())).once();
      done();
    });
  });

  it("should post item to basket when 'addItemsToBasket' is called", done => {
    store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({}));

    basketService.addItemsToBasket([itemMockData]).subscribe(() => {
      verify(apiService.post(`baskets/${BasketMockData.getBasket().id}/items`, anything(), anything())).once();
      done();
    });
  });

  it("should post source basket to basket when 'mergeBasket' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({}));
    when(apiService.post(`baskets`, anything(), anything())).thenReturn(of(basketMockData));
    when(apiService.post(`baskets/${basketMockData.data.id}/merges`, anything(), anything())).thenReturn(
      of(basketMergeResponseData)
    );

    basketService.mergeBasket(sourceBasket, anyString()).subscribe(() => {
      verify(apiService.post(`baskets/${basketMockData.data.id}/merges`, anything(), anything())).once();
      done();
    });
  });

  it("should patch updated data to basket line item of a basket when 'updateBasketItem' is called", done => {
    when(apiService.patch(anyString(), anything(), anything())).thenReturn(of({}));

    const payload = { quantity: { value: 2 } } as BasketItemUpdateType;
    basketService.updateBasketItem(lineItemData.id, payload).subscribe(() => {
      verify(apiService.patch(`baskets/current/items/${lineItemData.id}`, payload, anything())).once();
      done();
    });
  });

  it("should remove line item from specific basket when 'deleteBasketItem' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    basketService.deleteBasketItem(lineItemData.id).subscribe(() => {
      verify(apiService.delete(`baskets/current/items/${lineItemData.id}`, anything())).once();
      done();
    });
  });

  it("should add promotion code to specific basket when 'addPromotionCodeToBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({}));

    basketService.addPromotionCodeToBasket('code').subscribe(() => {
      verify(apiService.post(`baskets/current/promotioncodes`, anything(), anything())).once();
      done();
    });
  });

  it("should remove a promotion code from a specific basket when 'removePromotionCodeFromBasket' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    basketService.removePromotionCodeFromBasket('promoCode').subscribe(() => {
      verify(apiService.delete(`baskets/current/promotioncodes/promoCode`, anything())).once();
      done();
    });
  });

  it("should create a basket address when 'createBasketAddress' is called", done => {
    when(apiService.post(anyString(), anything(), anything())).thenReturn(of({ data: {} as Address }));

    basketService.createBasketAddress(BasketMockData.getAddress()).subscribe(() => {
      verify(apiService.post(`baskets/current/addresses`, anything(), anything())).once();
      done();
    });
  });

  it("should update a basket address when 'updateBasketAddress' is called", done => {
    when(apiService.patch(anyString(), anything(), anything())).thenReturn(of({ data: {} as Address }));

    const address = BasketMockData.getAddress();

    basketService.updateBasketAddress(address).subscribe(() => {
      verify(apiService.patch(`baskets/current/addresses/${address.id}`, anything(), anything())).once();
      done();
    });
  });

  it("should get eligible shipping methods for a basket when 'getBasketEligibleShippingMethods' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    basketService.getBasketEligibleShippingMethods().subscribe(() => {
      verify(apiService.get(`baskets/current/eligible-shipping-methods`, anything())).once();
      done();
    });
  });
});
