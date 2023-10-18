import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { combineLatest, skip } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { CustomerLoginType } from 'ish-core/models/customer/customer.model';
import { Order } from 'ish-core/models/order/order.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadBasketSuccess } from 'ish-core/store/customer/basket';
import {
  CUSTOMER_STORE_CONFIG,
  CustomerStoreConfig,
  CustomerStoreModule,
} from 'ish-core/store/customer/customer-store.module';
import { loadOrderSuccess, selectOrder } from 'ish-core/store/customer/orders';
import { loginUserSuccess, logoutUserSuccess } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { ApiTokenCookie, ApiTokenService } from './api-token.service';

describe('Api Token Service', () => {
  let apiTokenService: ApiTokenService;
  let cookieServiceMock: CookiesService;

  let store: Store;

  const initialApiTokenCookie: ApiTokenCookie = {
    apiToken: '123@apiToken',
    type: 'user',
  };

  const injectServices = (cookieServiceMock: CookiesService) => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTestingWithMetaReducer('basket', 'user', 'orders'),
      ],
      providers: [
        { provide: CookiesService, useFactory: () => instance(cookieServiceMock) },
        { provide: CUSTOMER_STORE_CONFIG, useClass: CustomerStoreConfig },
      ],
    });

    apiTokenService = TestBed.inject(ApiTokenService);
    store = TestBed.inject(Store);
  };

  beforeEach(() => {
    cookieServiceMock = mock(CookiesService);
  });

  it('should be created', () => {
    injectServices(cookieServiceMock);
    expect(apiTokenService).toBeTruthy();
  });

  describe('getInternalApiTokenCookieValue$', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify({ apiToken: '123' } as ApiTokenCookie));
      injectServices(cookieServiceMock);
    });

    it('should create user apiToken cookie when only user information changes in store', () => {
      store.dispatch(loginUserSuccess({ user: { firstName: 'Test', lastName: 'User' } } as CustomerLoginType));

      verify(
        cookieServiceMock.put(
          'apiToken',
          JSON.stringify({ apiToken: '123', type: 'user', isAnonymous: false, creator: 'pwa' } as ApiTokenCookie),
          anything()
        )
      ).once();
    });

    it('should create anonymous user apiToken cookie when only basket information changes in store', () => {
      store.dispatch(loadBasketSuccess({ basket: { id: 'new-basket' } as Basket }));

      verify(
        cookieServiceMock.put(
          'apiToken',
          JSON.stringify({ apiToken: '123', type: 'user', isAnonymous: true, creator: 'pwa' } as ApiTokenCookie),
          anything()
        )
      ).once();
    });

    it('should create order apiToken cookie when only order is selected in store', () => {
      store.dispatch(selectOrder({ orderId: 'orderId' }));

      verify(
        cookieServiceMock.put(
          'apiToken',
          JSON.stringify({ apiToken: '123', type: 'order', orderId: 'orderId', creator: 'pwa' } as ApiTokenCookie),
          anything()
        )
      ).once();
    });

    it('should update apiToken information in cookie when apiToken changes', () => {
      apiTokenService.setApiToken('new-api-token');

      verify(
        cookieServiceMock.put('apiToken', JSON.stringify({ apiToken: 'new-api-token' } as ApiTokenCookie), anything())
      ).once();
    });
  });

  describe('logout$', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify({ apiToken: '123' } as ApiTokenCookie));
      injectServices(cookieServiceMock);

      store.dispatch(
        loginUserSuccess({ userId: 'user', user: { firstName: 'Test', lastName: 'User' } } as CustomerLoginType)
      );
    });

    it('should remove apiToken on logout', () => {
      store.dispatch(logoutUserSuccess());

      verify(cookieServiceMock.remove('apiToken', anything())).once();
    });
  });

  describe('cookieVanish$', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
      injectServices(cookieServiceMock);
    });

    it('should vanish apiToken information when cookie is removed unexpectedly from the outside', done => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie), undefined);
      combineLatest([apiTokenService.apiToken$, apiTokenService.cookieVanishes$]).subscribe(
        ([apiToken, cookieVanishes]) => {
          expect(apiToken).toBeUndefined();
          expect(cookieVanishes).toEqual('user');
          done();
        }
      );

      setTimeout(() => undefined, 3000);
    });
  });

  describe('tokenCreatedOnAnotherTab$', () => {
    beforeEach(() => {
      injectServices(cookieServiceMock);
    });

    it('should set correct apiToken when new apiToken is set unexpectedly from the outside', done => {
      when(cookieServiceMock.get('apiToken')).thenReturn(undefined, JSON.stringify(initialApiTokenCookie));
      apiTokenService.apiToken$.pipe(skip(1)).subscribe(apiToken => {
        expect(apiToken).toEqual('123@apiToken');
        done();
      });

      setTimeout(() => undefined, 3000);
    });
  });

  describe('restore$', () => {
    describe('user', () => {
      it('should react on a loaded user in state for a non anonymous user', done => {
        when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
        injectServices(cookieServiceMock);

        store.dispatch(loginUserSuccess({ customer: { customerNo: '123' } } as CustomerLoginType));

        apiTokenService.restore$().subscribe(restored => {
          expect(restored).toBeTrue();

          done();
        });
      });

      it('should react on a loaded basket in state for an anonymous user', done => {
        when(cookieServiceMock.get('apiToken')).thenReturn(
          JSON.stringify({
            ...initialApiTokenCookie,
            isAnonymous: true,
          } as ApiTokenCookie)
        );
        injectServices(cookieServiceMock);

        store.dispatch(loadBasketSuccess({ basket: { id: '123', totals: {} } as Basket }));

        apiTokenService.restore$().subscribe(restored => {
          expect(restored).toBeTrue();

          done();
        });
      });

      it('should react on no state state changes when types list is not available', done => {
        when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
        injectServices(cookieServiceMock);

        apiTokenService.restore$([]).subscribe(restored => {
          expect(restored).toBeTrue();

          done();
        });
      });
    });

    describe('order', () => {
      it('should react on a loaded order in state when an order apiToken type is available', done => {
        when(cookieServiceMock.get('apiToken')).thenReturn(
          JSON.stringify({
            ...initialApiTokenCookie,
            type: 'order',
            orderId: '123',
          } as ApiTokenCookie)
        );
        injectServices(cookieServiceMock);

        store.dispatch(loadOrderSuccess({ order: { id: '123' } as Order }));

        apiTokenService.restore$().subscribe(restored => {
          expect(restored).toBeTrue();

          done();
        });
      });
    });
  });
});
