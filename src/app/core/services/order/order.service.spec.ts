import { APP_BASE_HREF } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TokenResponse } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { OrderListQuery } from 'ish-core/models/order-list-query/order-list-query.model';
import { OrderBaseData } from 'ish-core/models/order/order.interface';
import { Order } from 'ish-core/models/order/order.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { TokenService } from 'ish-core/services/token/token.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { OrderService, orderListQueryToHttpParams } from './order.service';

describe('Order Service', () => {
  let orderService: OrderService;
  let apiService: ApiService;
  let tokenService: TokenService;
  let appFacade: AppFacade;

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
    tokenService = mock(TokenService);
    appFacade = mock(AppFacade);

    when(apiService.encodeResourceId(anything())).thenCall(id => id);
    when(appFacade.serverSetting$(anything())).thenReturn(of(false));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: APP_BASE_HREF, useFactory: () => '/' },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: TokenService, useFactory: () => instance(tokenService) },
        provideMockStore({ selectors: [{ selector: getCurrentLocale, value: 'en_US' }] }),
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
    it("should get orders when 'getOrders' is called with amount", done => {
      when(apiService.get(anything(), anything())).thenReturn(of([]));

      orderService.getOrders({ limit: 30 }).subscribe(() => {
        verify(apiService.get('orders', anything())).once();
        const options: AvailableOptions = capture(apiService.get).last()[1];
        expect(options.params?.toString()).toMatchInlineSnapshot(`"limit=30"`);
        done();
      });
    });
  });

  describe('orderListQueryToHttpParams', () => {
    it.each([
      [{ limit: 10 }, 'limit=10'],
      [{ limit: 10, include: ['commonShipToAddress'] }, 'limit=10&include=commonShipToAddress'],
      [{ limit: 30, include: ['discounts', 'payments'] }, 'limit=30&include=discounts,payments'],
    ] as [OrderListQuery, string][])('should convert %j to %s', (query, expected) => {
      const params = orderListQueryToHttpParams(query);
      expect(params.toString()).toEqual(expected);
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
    when(tokenService.fetchToken('refresh_token', anything())).thenReturn(
      of({ access_token: 'dummy' } as TokenResponse)
    );

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

  describe('continueOrderCreation', () => {
    it('should throw error when called without orderId', done => {
      orderService.continueOrderCreation(undefined).subscribe({
        error: err => {
          expect(err.message).toEqual('continueOrderCreation() called without orderId');
          done();
        },
      });
    });

    it('should call the API with correct parameters', done => {
      when(apiService.patch(anything(), anything(), anything())).thenReturn(of(orderMockData));

      const orderId = '123454';

      orderService.continueOrderCreation(orderId).subscribe(() => {
        verify(apiService.patch(`orders/${orderId}`, anything(), anything())).once();
        const [, body] = capture(apiService.patch).first();
        expect(body).toEqual({ orderCreation: { status: 'CONTINUE' } });
        done();
      });
    });

    it('should return an order when it is called', done => {
      when(apiService.patch(anything(), anything(), anything())).thenReturn(of(orderMockData));

      orderService.continueOrderCreation('123454').subscribe(data => {
        expect(data).toHaveProperty('id', 'test');
        done();
      });
    });
  });
});
