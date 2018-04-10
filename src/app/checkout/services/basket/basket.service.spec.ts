import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { BasketService } from './basket.service';

describe('Basket Service', () => {
  let basketService: BasketService;
  let apiService: ApiService;

  const basketMockData = {
    id: 'test',
    shippingBuckets: [{
      lineItems: [],
      shippingMethod: {},
      shipToAddress: {}
    }]
  };

  const itemMockData = {
    sku: 'test',
    quantity: 10
  };

  beforeEach(() => {
    apiService = mock(ApiService);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        BasketService
      ]
    });

    basketService = TestBed.get(BasketService);
  });

  it('should get Basket data when \'getBasket\' is called', () => {
    when(apiService.get(basketService.basketServiceIdentifier + basketMockData.id))
      .thenReturn(of(basketMockData));

    basketService.getBasket(basketMockData.id).subscribe(data => {
      expect(data.id).toEqual(basketMockData.id);
    });

    verify(apiService.get(basketService.basketServiceIdentifier + basketMockData.id)).once();
  });

  it('should post item to basket when \'addItemToBasket\' is called', () => {
    when(apiService.post(anything(), anything()))
      .thenReturn(of({}));

    basketService.addItemToBasket(itemMockData.sku, itemMockData.quantity, basketMockData.id)
      .subscribe(() => {
        expect(true).toBeTruthy();
      });

    verify(
      apiService.post(
        basketService.basketServiceIdentifier + basketMockData.id + '/items/',
        anything()
      )
    ).once();
  });
});
