import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api/api.service';
import { BasketService } from './basket.service';

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
  };

  beforeEach(() => {
    apiService = mock(ApiService);
    basketService = new BasketService(instance(apiService));
  });

  it("should get basket data when 'getBasket' is called", done => {
    when(apiService.get(`baskets/${basketMockData.id}`)).thenReturn(of(basketMockData));

    basketService.getBasket(basketMockData.id).subscribe(data => {
      expect(data.id).toEqual(basketMockData.id);
      verify(apiService.get(`baskets/${basketMockData.id}`)).once();
      done();
    });
  });

  it("should update data to basket of a specific basket when 'updateBasket' is called", done => {
    when(apiService.put(anything(), anything())).thenReturn(of({}));

    basketService.updateBasket(basketMockData.id, { invoiceToAddress: { id: '123456' } }).subscribe(() => {
      verify(apiService.put(`baskets/${basketMockData.id}`, anything())).once();
      done();
    });
  });

  it("should get basket items for specific basketId when 'getBasketItems' is called", done => {
    when(apiService.get(`baskets/${basketMockData.id}/items`)).thenReturn(of([]));

    basketService.getBasketItems(basketMockData.id).subscribe(() => {
      verify(apiService.get(`baskets/${basketMockData.id}/items`)).once();
      done();
    });
  });

  it("should post item to basket when 'addItemsToBasket' is called", done => {
    when(apiService.post(anything(), anything())).thenReturn(of({}));

    basketService.addItemsToBasket([itemMockData], basketMockData.id).subscribe(() => {
      verify(apiService.post(`baskets/${basketMockData.id}/items`, anything())).once();
      done();
    });
  });

  it("should put updated data to basket line item of spefic basket when 'updateBasketItem' is called", done => {
    when(apiService.put(anything(), anything())).thenReturn(of({}));

    basketService.updateBasketItem(lineItemData.id, 2, basketMockData.id).subscribe(() => {
      verify(apiService.put(`baskets/${basketMockData.id}/items/${lineItemData.id}`, anything())).once();
      done();
    });
  });

  it("should remove line item from spefic basket when 'deleteBasketItem' is called", done => {
    when(apiService.delete(anything())).thenReturn(of({}));

    basketService.deleteBasketItem(lineItemData.id, basketMockData.id).subscribe(() => {
      verify(apiService.delete(`baskets/${basketMockData.id}/items/${lineItemData.id}`)).once();
      done();
    });
  });

  it("should get basket payments for specific basketId when 'getBasketPayments' is called", done => {
    when(apiService.get(`baskets/${basketMockData.id}/payments`)).thenReturn(of([]));

    basketService.getBasketPayments(basketMockData.id).subscribe(() => {
      verify(apiService.get(`baskets/${basketMockData.id}/payments`)).once();
      done();
    });
  });
});
