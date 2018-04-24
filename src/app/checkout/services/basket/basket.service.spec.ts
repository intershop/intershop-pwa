import { of } from 'rxjs/observable/of';
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

  it("should post item to basket when 'addItemToBasket' is called", () => {
    when(apiService.post(anything(), anything())).thenReturn(of({}));

    basketService.addItemToBasket(itemMockData.sku, itemMockData.quantity, basketMockData.id).subscribe(() => {
      expect(true).toBeTruthy();
    });

    verify(apiService.post(`baskets/${basketMockData.id}/items`, anything())).once();
  });
});
