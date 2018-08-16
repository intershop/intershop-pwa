import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from '../../../core/services/api/api.service';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';

import { OrderService } from './order.service';

describe('Order Service', () => {
  let orderService: OrderService;
  let apiService: ApiService;
  const basketMock = BasketMockData.getBasket();

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.icmServerURL).thenReturn('http://server');

    TestBed.configureTestingModule({
      providers: [OrderService, { provide: ApiService, useFactory: () => instance(apiService) }],
    });

    orderService = TestBed.get(OrderService);
  });

  it("should create an order when 'createOrder' is called", done => {
    when(apiService.post(anything(), anything())).thenReturn(of({ type: 'Link', uri: 'site/-/orders/orderid' }));
    when(apiService.get(anything())).thenReturn(of({ id: 'basket', totals: {} }));

    orderService.createOrder(basketMock, true).subscribe(data => {
      verify(apiService.post('orders', anything())).once();
      verify(apiService.get('http://server/site/-/orders/orderid')).once();
      expect(data).toHaveProperty('id', 'basket');
      done();
    });
  });
});
