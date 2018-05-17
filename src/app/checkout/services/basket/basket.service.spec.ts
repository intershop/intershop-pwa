import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
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

  it("should get basket data when 'getBasket' is called", () => {
    when(apiService.get(`baskets/${basketMockData.id}`)).thenReturn(of(basketMockData));

    basketService.getBasket(basketMockData.id).subscribe(data => {
      expect(data.id).toEqual(basketMockData.id);
    });

    verify(apiService.get(`baskets/${basketMockData.id}`)).once();
  });

  it("should get basket items for specific basketId when 'getBasketItems' is called", () => {
    when(apiService.get(`baskets/${basketMockData.id}/items`, anything(), anything(), true)).thenReturn(of([]));

    basketService.getBasketItems(basketMockData.id).subscribe(() => {
      expect(true).toBeTruthy();
    });

    verify(apiService.get(`baskets/${basketMockData.id}/items`, anything(), anything(), true)).once();
  });

  it("should post item to basket when 'addItemsToBasket' is called", () => {
    when(apiService.post(anything(), anything())).thenReturn(of({}));

    basketService.addItemsToBasket([itemMockData], basketMockData.id).subscribe(() => {
      expect(true).toBeTruthy();
    });

    verify(apiService.post(`baskets/${basketMockData.id}/items`, anything())).once();
  });

  it("should put updated data to basket line item of spefic basket when 'updateBasketItem' is called", () => {
    when(apiService.put(anything(), anything())).thenReturn(of({}));

    basketService.updateBasketItem(lineItemData.id, 2, basketMockData.id).subscribe(() => {
      expect(true).toBeTruthy();
    });

    verify(apiService.put(`baskets/${basketMockData.id}/items/${lineItemData.id}`, anything())).once();
  });

  it("should remove line item from spefic basket when 'deleteBasketItem' is called", () => {
    when(apiService.delete(anything())).thenReturn(of({}));

    basketService.deleteBasketItem(lineItemData.id, basketMockData.id).subscribe(() => {
      expect(true).toBeTruthy();
    });

    verify(apiService.delete(`baskets/${basketMockData.id}/items/${lineItemData.id}`)).once();
  });
});
