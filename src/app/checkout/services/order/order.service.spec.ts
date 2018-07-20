import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../../../core/services/api/api.service';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';
import { OrderService } from './order.service';

describe('Order Service', () => {
  let orderService: OrderService;
  let apiService: ApiService;
  const basketMock = BasketMockData.getBasket();

  beforeEach(() => {
    apiService = mock(ApiService);
    orderService = new OrderService(instance(apiService));
  });

  it("should create an order when 'createOrder' is called", done => {
    when(apiService.post(anything(), anything())).thenReturn(of({}));

    orderService.createOrder(basketMock, true).subscribe(() => {
      verify(apiService.post('orders', anything())).once();
      done();
    });
  });
});
