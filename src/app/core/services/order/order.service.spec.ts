import { HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Locale } from 'ish-core/models/locale/locale.model';
import { OrderBaseData } from 'ish-core/models/order/order.interface';
import { Order } from 'ish-core/models/order/order.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { OrderService } from './order.service';

describe('Order Service', () => {
  let orderService: OrderService;
  let apiService: ApiService;
  const basketMock = BasketMockData.getBasket();
  const orderMockData = {
    data: {
      id: 'test',
      documentNumber: '000001',
      status: 'New',
      statusCode: 'NEW',
    } as OrderBaseData,
  };

  beforeEach(() => {
    apiService = mock(ApiService);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        provideMockStore({ selectors: [{ selector: getCurrentLocale, value: { lang: 'en_US' } as Locale }] }),
      ],
    });

    orderService = TestBed.inject(OrderService);
  });

  describe('createOrder', () => {
    it('should create an order when it is called', done => {
      when(apiService.post(anything(), anything(), anything())).thenReturn(of(orderMockData));
      when(apiService.patch(anything(), anything(), anything())).thenReturn(of(orderMockData));

      orderService.createOrder(basketMock.id, true).subscribe(data => {
        verify(apiService.post('orders', anything(), anything())).once();
        verify(apiService.patch(`orders/${orderMockData.data.id}`, anything(), anything())).never();
        expect(data).toHaveProperty('id', 'test');
        done();
      });
    });

    it('should send return URL after order creation if necessary', done => {
      const extOrderMockData = { ...orderMockData };
      extOrderMockData.data.orderCreation = {
        status: 'STOPPED',
        stopAction: { type: 'Workflow', exitReason: 'redirect_urls_required' },
      };

      when(apiService.post(anything(), anything(), anything())).thenReturn(of(extOrderMockData));
      when(apiService.patch(anything(), anything(), anything())).thenReturn(of(orderMockData));

      orderService.createOrder(basketMock.id, true).subscribe(() => {
        verify(apiService.post('orders', anything(), anything())).once();
        verify(apiService.patch(`orders/${orderMockData.data.id}`, anything(), anything())).once();
        done();
      });
    });
  });

  describe('getOrders', () => {
    it("should get orders when 'getOrders' is called without amount", done => {
      when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

      orderService.getOrders().subscribe(() => {
        verify(apiService.get(`orders?page[limit]=30`, anything())).once();
        done();
      });
    });

    it("should get orders when 'getOrders' is called with amount", done => {
      when(apiService.get(anything(), anything())).thenReturn(of([]));

      const amount = 10;
      orderService.getOrders(amount).subscribe(() => {
        verify(apiService.get(`orders?page[limit]=10`, anything())).once();
        done();
      });
    });
  });

  it("should get an order when 'getOrder' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: {} }));

    const orderId = '123454';

    orderService.getOrder(orderId).subscribe(() => {
      verify(apiService.get(`orders/${orderId}`, anything())).once();
      done();
    });
  });

  it('should load an order by token for an anonymous user', done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: { id: 'id12345' } as Order }));

    orderService.getOrderByToken('id12345', 'dummy').subscribe(data => {
      verify(apiService.get(anything(), anything())).once();
      const [path, options] = capture<string, { headers: HttpHeaders }>(apiService.get).last();
      expect(path).toEqual('orders/id12345');
      expect(options.headers.get(ApiService.TOKEN_HEADER_KEY)).toEqual('dummy');
      expect(data).toHaveProperty('id', 'id12345');
      done();
    });
  });

  describe('updatePayment', () => {
    it('should update payment data when it is called', done => {
      when(apiService.patch(anything(), anything(), anything())).thenReturn(of(undefined));

      const orderId = '123454';
      const params = { redirect: 'success', param1: '123', orderId };

      orderService.updateOrderPayment(orderId, params).subscribe(() => {
        verify(apiService.patch(`orders/${orderId}`, anything(), anything())).once();
        done();
      });
    });
  });
});
