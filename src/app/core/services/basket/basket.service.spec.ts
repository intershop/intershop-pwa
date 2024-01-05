import { HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { noop, of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { BasketData } from 'ish-core/models/basket/basket.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketService } from './basket.service';

describe('Basket Service', () => {
  let basketService: BasketService;
  let apiService: ApiService;
  let orderService: OrderService;

  const basketMockData = {
    data: {
      id: 'test',
      calculated: false,
      buckets: [],
      payment: {
        name: 'testPayment',
        id: 'paymentId',
      },
      totals: undefined,
    },
  } as BasketData;

  beforeEach(() => {
    apiService = mock(ApiService);
    orderService = mock(OrderService);

    when(apiService.currentBasketEndpoint()).thenReturn(instance(apiService));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: OrderService, useFactory: () => instance(orderService) },
      ],
    });

    basketService = TestBed.inject(BasketService);
  });

  it("should get basket data when 'getBasket' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of(basketMockData));

    basketService.getBasket().subscribe(data => {
      expect(data.id).toEqual(basketMockData.data.id);
      // basket-endpoint 'baskets/current' is not considered in the verify, only data that comes after it
      verify(apiService.get('', anything())).once();
      done();
    });
  });

  it('should fetch the basket with the basket id from the state or the given id', done => {
    const basketId = 'basket123';
    const basketData = { data: { id: basketId } } as BasketData;
    when(apiService.get(anything(), anything())).thenReturn(of(basketData));

    basketService.getBasket().subscribe(noop);
    basketService.getBasketWithId(basketId).subscribe(noop);
    basketService.getBasket().subscribe(noop);
    verify(apiService.get('', anything())).twice();
    verify(apiService.get(`baskets/${basketId}`, anything())).once();
    done();
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
      verify(apiService.patch('', payload, anything())).once();
      done();
    });
  });

  it("should validate the basket when 'validateBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of(undefined));

    basketService.validateBasket().subscribe(() => {
      verify(apiService.post('validations', anything(), anything())).once();
      done();
    });
  });

  it("should get active baskets of the current user when 'getBaskets' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({}));

    basketService.getBaskets().subscribe(() => {
      verify(apiService.get('baskets', anything())).once();
      done();
    });
  });

  it("should post source basket to basket when 'mergeBasket' is called", done => {
    when(apiService.post(`baskets/${basketMockData.data.id}/merges`, anything(), anything())).thenReturn(
      of({
        data: {
          sourceBasket: '012345',
          targetBasket: basketMockData.data.id,
        },
        included: {
          targetBasket: {
            [basketMockData.data.id]: {
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
      })
    );

    basketService.mergeBasket('012345', 'TOKEN', basketMockData.data.id).subscribe(() => {
      verify(apiService.post(`baskets/${basketMockData.data.id}/merges`, anything(), anything())).once();
      done();
    });
  });

  it("should add promotion code to specific basket when 'addPromotionCodeToBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({}));

    basketService.addPromotionCodeToBasket('code').subscribe(() => {
      verify(apiService.post('promotioncodes', anything(), anything())).once();
      done();
    });
  });

  it("should remove a promotion code from a specific basket when 'removePromotionCodeFromBasket' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    basketService.removePromotionCodeFromBasket('promoCode').subscribe(() => {
      verify(apiService.delete('promotioncodes/promoCode', anything())).once();
      done();
    });
  });

  it("should create a basket address when 'createBasketAddress' is called", done => {
    when(apiService.post(anyString(), anything(), anything())).thenReturn(of({ data: {} as Address }));

    basketService.createBasketAddress(BasketMockData.getAddress()).subscribe(() => {
      verify(apiService.post('addresses', anything(), anything())).once();
      done();
    });
  });

  it("should update a basket address when 'updateBasketAddress' is called", done => {
    when(apiService.patch(anyString(), anything(), anything())).thenReturn(of({ data: {} as Address }));

    const address = BasketMockData.getAddress();

    basketService.updateBasketAddress(address).subscribe(() => {
      verify(apiService.patch(`addresses/${address.id}`, anything(), anything())).once();
      done();
    });
  });

  it("should get eligible addresses for a basket when 'getBasketEligibleAddresses' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    basketService.getBasketEligibleAddresses().subscribe(() => {
      verify(apiService.get('eligible-addresses', anything())).once();
      done();
    });
  });

  it("should get eligible shipping methods for a basket when 'getBasketEligibleShippingMethods' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    basketService.getBasketEligibleShippingMethods().subscribe(() => {
      verify(apiService.get('eligible-shipping-methods', anything())).once();
      done();
    });
  });

  it("should submit a basket for approval when 'submitBasket' is called", done => {
    when(orderService.createOrder(anything(), anything())).thenReturn(
      throwError(() => makeHttpError({ message: 'invalid', status: 422 }))
    );

    basketService.createRequisition('basketId').subscribe(() => {
      verify(orderService.createOrder('basketId', anything())).once();
      done();
    });
  });

  it("should create an attribute for a basket when 'createBasketAttribute' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({}));

    basketService.createBasketAttribute({ name: 'attr', value: 'xyz' }).subscribe(() => {
      verify(apiService.post('attributes', anything(), anything())).once();
      done();
    });
  });

  it("should update an attribute for a basket when 'updateBasketAttribute' is called", done => {
    when(apiService.patch(anything(), anything(), anything())).thenReturn(of({}));

    basketService.updateBasketAttribute({ name: 'attr', value: 'xyz' }).subscribe(() => {
      verify(apiService.patch('attributes/attr', anything(), anything())).once();
      done();
    });
  });

  it("should delete an attribute for a basket when 'deleteBasketAttribute' is called", done => {
    when(apiService.delete(anything(), anything())).thenReturn(of({}));

    basketService.deleteBasketAttribute('attr').subscribe(() => {
      verify(apiService.delete('attributes/attr', anything())).once();
      done();
    });
  });
  it("should add a quote to the basket if 'addQuoteToBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({}));

    basketService.addQuoteToBasket('quoteId').subscribe(() => {
      verify(apiService.post(anything(), anything(), anything())).once();
      const [path, body] = capture(apiService.post).last();
      expect(path).toMatchInlineSnapshot(`"quotes"`);
      expect(body).toMatchInlineSnapshot(`
        {
          "calculated": true,
          "id": "quoteId",
        }
      `);
      done();
    });
  });

  it("should delete a quote from the basket if 'deleteQuoteFromBasket' is called", done => {
    when(apiService.delete(anything(), anything())).thenReturn(of({}));

    basketService.deleteQuoteFromBasket('quoteId').subscribe(() => {
      verify(apiService.delete(anything(), anything())).once();
      const [path] = capture(apiService.delete).last();
      expect(path).toMatchInlineSnapshot(`"quotes/quoteId"`);
      done();
    });
  });
});
