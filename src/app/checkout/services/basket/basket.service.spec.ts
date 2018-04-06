import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { Basket } from '../../../models/basket/basket.model';
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

  beforeEach(() => {
    apiService = mock(ApiService);
    basketService = new BasketService(instance(apiService));
  });

  it('should get Basket data when \'getBasket\' is called', () => {
    when(apiService.get(basketService.basketServiceIdentifier + basketMockData.id))
      .thenReturn(of(basketMockData));

    basketService.getBasket(basketMockData.id).subscribe(data => {
      expect(data.id).toEqual(basketMockData.id);
    });

    verify(apiService.get(basketService.basketServiceIdentifier + basketMockData.id)).once();
  });
});
