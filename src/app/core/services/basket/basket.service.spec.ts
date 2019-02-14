import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from '../api/api.service';

import { BasketItemUpdateType, BasketService } from './basket.service';

describe('Basket Service', () => {
  let basketService: BasketService;
  let apiService: ApiService;

  const basketMockData = {
    id: 'test',
    shippingBuckets: [
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
  };

  const lineItemData = {
    id: 'test',
    quantity: {
      type: 'Quantity',
      unit: '',
      value: 1,
    },
  };

  const basketMockDataV1 = {
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

  const itemMockData = {
    sku: 'test',
    quantity: 10,
  };

  beforeEach(() => {
    apiService = mock(ApiService);
    basketService = new BasketService(instance(apiService));
  });

  it("should get basket data when 'getBasket' is called", done => {
    when(apiService.get(`baskets/${basketMockDataV1.data.id}`, anything())).thenReturn(of(basketMockDataV1));

    basketService.getBasket(basketMockDataV1.data.id).subscribe(data => {
      expect(data.id).toEqual(basketMockData.id);
      verify(apiService.get(`baskets/${basketMockDataV1.data.id}`, anything())).once();
      done();
    });
  });

  it("should create a basket data when 'createBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of(basketMockDataV1));

    basketService.createBasket().subscribe(data => {
      expect(data.id).toEqual(basketMockData.id);
      verify(apiService.post(`baskets`, anything(), anything())).once();
      done();
    });
  });

  it("should update data to basket of a specific basket when 'updateBasket' is called", done => {
    when(apiService.patch(anything(), anything(), anything())).thenReturn(of(basketMockDataV1));
    const payload = { invoiceToAddress: '123456' };

    basketService.updateBasket(basketMockData.id, payload).subscribe(() => {
      verify(apiService.patch(`baskets/${basketMockData.id}`, payload, anything())).once();
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
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({}));

    basketService.addItemsToBasket(basketMockData.id, [itemMockData]).subscribe(() => {
      verify(apiService.post(`baskets/${basketMockData.id}/items`, anything(), anything())).once();
      done();
    });
  });

  it("should patch updated data to basket line item of a basket when 'updateBasketItem' is called", done => {
    when(apiService.patch(anyString(), anything(), anything())).thenReturn(of({}));

    const payload = { quantity: { value: 2 } } as BasketItemUpdateType;
    basketService.updateBasketItem(basketMockData.id, lineItemData.id, payload).subscribe(() => {
      verify(apiService.patch(`baskets/${basketMockData.id}/items/${lineItemData.id}`, payload, anything())).once();
      done();
    });
  });

  it("should remove line item from spefic basket when 'deleteBasketItem' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    basketService.deleteBasketItem(basketMockData.id, lineItemData.id).subscribe(() => {
      verify(apiService.delete(`baskets/${basketMockData.id}/items/${lineItemData.id}`, anything())).once();
      done();
    });
  });

  it("should get eligible shipping methods for a basket when 'getBasketEligibleShippingMethods' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    basketService.getBasketEligibleShippingMethods(basketMockData.id).subscribe(() => {
      verify(apiService.get(`baskets/${basketMockData.id}/eligible-shipping-methods`, anything())).once();
      done();
    });
  });

  it("should get basket eligible payment methods for a basket when 'getBasketEligiblePaymentMethods' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    basketService.getBasketEligiblePaymentMethods(basketMockData.id).subscribe(() => {
      verify(apiService.get(`baskets/${basketMockData.id}/eligible-payment-methods`, anything())).once();
      done();
    });
  });

  it("should set a payment to the basket when 'setBasketPayment' is called", done => {
    when(apiService.put(`baskets/${basketMockData.id}/payments/open-tender`, anything(), anything())).thenReturn(
      of([])
    );

    basketService.setBasketPayment(basketMockData.id, basketMockData.payment.name).subscribe(() => {
      verify(apiService.put(`baskets/${basketMockData.id}/payments/open-tender`, anything(), anything())).once();
      done();
    });
  });
});
