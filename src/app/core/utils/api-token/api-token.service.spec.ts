import { HttpErrorResponse, HttpEvent, HttpHandler, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { combineLatest, noop, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { CustomerLoginType } from 'ish-core/models/customer/customer.model';
import { Order } from 'ish-core/models/order/order.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadBasketSuccess } from 'ish-core/store/customer/basket';
import {
  CUSTOMER_STORE_CONFIG,
  CustomerStoreConfig,
  CustomerStoreModule,
} from 'ish-core/store/customer/customer-store.module';
import { loadOrderSuccess, selectOrder } from 'ish-core/store/customer/orders';
import { loadUserByAPIToken, loginUserSuccess, resetUserData } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { ApiTokenCookie, ApiTokenService } from './api-token.service';

describe('Api Token Service', () => {
  let apiTokenService: ApiTokenService;
  let cookieServiceMock: CookiesService;

  let store: Store;

  const accessToken = '123@accessToken';

  const initialApiTokenCookie: ApiTokenCookie = {
    apiToken: '123@refreshToken',
    type: 'user',
  };

  const injectServices = () => {
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
    injectServices();
    expect(apiTokenService).toBeTruthy();
  });

  describe('initialization', () => {
    it('should not authenticate requests with the apiToken of the cookie', done => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
      injectServices();

      verify(cookieServiceMock.remove('apiToken', anything())).never();
      apiTokenService.getApiToken$().subscribe(apiToken => {
        expect(apiToken).toBeUndefined();
        done();
      });
    });

    it('should remove an apiToken cookie with invalid content and not restore it', done => {
      when(cookieServiceMock.get('apiToken')).thenReturn('SOMETHING_INVALID');
      injectServices();
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      verify(cookieServiceMock.remove('apiToken', anything())).once();
      apiTokenService.restore$().subscribe(restored => {
        expect(restored).toBeTrue();
        expect(dispatchSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getInternalApiTokenCookieValue$', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify({ apiToken: '123@refresh' } as ApiTokenCookie));
      injectServices();
      apiTokenService.setApiToken('123', undefined, '123@refresh');
    });

    it('should create user apiToken cookie when only user information changes in store', () => {
      store.dispatch(loginUserSuccess({ user: { firstName: 'Test', lastName: 'User' } } as CustomerLoginType));

      verify(
        cookieServiceMock.put(
          'apiToken',
          JSON.stringify({
            apiToken: '123@refresh',
            type: 'user',
            isAnonymous: false,
            creator: 'pwa',
          } as ApiTokenCookie),
          anything()
        )
      ).once();
    });

    it('should create anonymous user apiToken cookie when only basket information changes in store', () => {
      store.dispatch(loadBasketSuccess({ basket: { id: 'new-basket' } as Basket }));

      verify(
        cookieServiceMock.put(
          'apiToken',
          JSON.stringify({
            apiToken: '123@refresh',
            type: 'user',
            isAnonymous: true,
            creator: 'pwa',
          } as ApiTokenCookie),
          anything()
        )
      ).once();
    });

    it('should create order apiToken cookie when only order is selected in store', () => {
      store.dispatch(selectOrder({ orderId: 'orderId' }));

      verify(
        cookieServiceMock.put(
          'apiToken',
          JSON.stringify({
            apiToken: '123@refresh',
            type: 'order',
            orderId: 'orderId',
            creator: 'pwa',
          } as ApiTokenCookie),
          anything()
        )
      ).once();
    });

    it('should save the new refresh token as apiToken in the cookie when the tokens change', () => {
      apiTokenService.setApiToken('new-access-token', undefined, 'new-refresh-token');

      verify(
        cookieServiceMock.put(
          'apiToken',
          JSON.stringify({ apiToken: 'new-refresh-token' } as ApiTokenCookie),
          anything()
        )
      ).once();
    });

    it('should not save an access token without refresh token in the cookie', () => {
      apiTokenService.setApiToken('new-access-token');

      verify(cookieServiceMock.put('apiToken', anything(), anything())).once();
      verify(cookieServiceMock.put('apiToken', JSON.stringify({ apiToken: '123@refresh' }), anything())).once();
    });
  });

  describe('logout$', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
      injectServices();

      store.dispatch(
        loginUserSuccess({ userId: 'user', user: { firstName: 'Test', lastName: 'User' } } as CustomerLoginType)
      );
    });

    it('should remove apiToken on resetUserData', () => {
      store.dispatch(resetUserData());

      verify(cookieServiceMock.remove('apiToken', anything())).once();
    });
  });

  describe('cookieVanish$', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
      injectServices();
    });

    it('should vanish apiToken information when cookie is removed unexpectedly from the outside', done => {
      apiTokenService.setApiToken(accessToken, undefined, initialApiTokenCookie.apiToken);
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie), undefined);
      combineLatest([apiTokenService.getApiToken$(), apiTokenService.getCookieVanishes$()]).subscribe(
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
      injectServices();
    });

    it('should restore the session with the refresh token when a user cookie is created by another tab', done => {
      TestBed.inject(ActionsSubject)
        .pipe(ofType(loadUserByAPIToken))
        .subscribe(action => {
          expect(action.payload.apiToken).toEqual(initialApiTokenCookie.apiToken);
          done();
        });
      when(cookieServiceMock.get('apiToken')).thenReturn(undefined, JSON.stringify(initialApiTokenCookie));

      setTimeout(() => undefined, 3000);
    });
  });

  describe('restore$', () => {
    describe('user', () => {
      it('should react on a loaded user in state for a non anonymous user', done => {
        when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
        injectServices();

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
        injectServices();

        store.dispatch(loadBasketSuccess({ basket: { id: '123', totals: {} } as Basket }));

        apiTokenService.restore$().subscribe(restored => {
          expect(restored).toBeTrue();

          done();
        });
      });

      it('should react on no state state changes when types list is not available', done => {
        when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
        injectServices();

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
        injectServices();

        store.dispatch(loadOrderSuccess({ order: { id: '123' } as Order }));

        apiTokenService.restore$().subscribe(restored => {
          expect(restored).toBeTrue();

          done();
        });
      });
    });
  });

  describe('invalidateApiToken', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
      injectServices();
      apiTokenService.setApiToken(accessToken, undefined, initialApiTokenCookie.apiToken);
    });

    it('should remove the apiToken and its cookie and inform cookieVanishes$ listeners', done => {
      apiTokenService.getCookieVanishes$().subscribe(type => {
        expect(type).toEqual('user');
        verify(cookieServiceMock.remove('apiToken', anything())).once();
        done();
      });

      apiTokenService.invalidateApiToken();
    });

    it('should keep the cookie if it contains the tokens of another tab', done => {
      when(cookieServiceMock.get('apiToken')).thenReturn(
        JSON.stringify({ ...initialApiTokenCookie, apiToken: 'other@refreshToken' })
      );

      apiTokenService.getCookieVanishes$().subscribe(() => {
        verify(cookieServiceMock.remove('apiToken', anything())).never();
        done();
      });

      apiTokenService.invalidateApiToken();
    });

    it('should not restore the invalid apiToken', done => {
      apiTokenService.invalidateApiToken();

      apiTokenService.restore$().subscribe(restored => {
        expect(restored).toBeTrue();
        done();
      });
    });

    it('should remove the apiToken and its cookie when the current refresh token is rejected', done => {
      apiTokenService.getCookieVanishes$().subscribe(() => {
        verify(cookieServiceMock.remove('apiToken', anything())).once();
        done();
      });

      apiTokenService.invalidateApiToken(initialApiTokenCookie.apiToken);
    });

    it('should ignore a rejected token that has already been replaced', done => {
      apiTokenService.invalidateApiToken('old@accessToken');

      verify(cookieServiceMock.remove('apiToken', anything())).never();
      apiTokenService.getApiToken$().subscribe(apiToken => {
        expect(apiToken).toEqual(accessToken);
        done();
      });
    });
  });

  describe('intercept', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
      injectServices();
    });

    describe('authentication header', () => {
      const expectHeader = (request: HttpRequest<unknown>, expected: string, done: jest.DoneCallback) => {
        const next: HttpHandler = {
          handle: req => {
            expect(req.headers.get(ApiService.TOKEN_HEADER_KEY)).toEqual(expected);
            return of(new HttpResponse({ status: 200, url: req.url }));
          },
        };
        apiTokenService.setApiToken(accessToken, undefined, initialApiTokenCookie.apiToken);
        apiTokenService.intercept(request, next).subscribe(() => done());
      };

      it('should add the access token to requests', done => {
        expectHeader(new HttpRequest('GET', 'https://icm/configurations'), accessToken, done);
      });

      it('should add the access token to the logout request', done => {
        expectHeader(new HttpRequest('PUT', 'https://icm/token/logout', undefined), accessToken, done);
      });

      it('should not add the access token to token grants', done => {
        const body = new HttpParams().set('grant_type', 'refresh_token').set('refresh_token', 'refresh');
        // eslint-disable-next-line unicorn/no-null
        expectHeader(new HttpRequest('POST', 'https://icm/token', body), null, done);
      });
    });

    it('should remove the id_token from the response of a token grant', done => {
      const body = new HttpParams().set('grant_type', 'refresh_token').set('refresh_token', 'refresh');
      const next: HttpHandler = {
        handle: req => of(new HttpResponse({ status: 200, url: req.url, body: { access_token: 'a', id_token: 'i' } })),
      };

      apiTokenService.intercept(new HttpRequest('POST', 'https://icm/token', body), next).subscribe(event => {
        expect((event as HttpResponse<Record<string, string>>).body).toEqual({
          access_token: 'a',
          id_token: undefined,
        });
        done();
      });
    });

    it.each([
      'Unauthorized ([warn] Verification of token failed.)',
      'Unauthorized ([none] Error when decrypting token)',
      'Unauthorized ([none] Unable to parse token.)',
    ])(
      'should remove the invalid apiToken and retry the request without it on error %j',
      fakeAsync((error: string) => {
        apiTokenService.setApiToken(accessToken, undefined, initialApiTokenCookie.apiToken);
        const requests: HttpRequest<unknown>[] = [];
        const next: HttpHandler = {
          handle: request => {
            requests.push(request);
            return requests.length === 1
              ? throwError(() => new HttpErrorResponse({ status: 401, error }))
              : of(new HttpResponse({ status: 200 }));
          },
        };

        let response: HttpEvent<unknown>;
        apiTokenService.intercept(new HttpRequest('GET', 'https://icm/configurations'), next).subscribe(event => {
          response = event;
        });
        tick(500);

        expect(requests[0].headers.get(ApiService.TOKEN_HEADER_KEY)).toEqual(accessToken);
        expect(requests[1].headers.has(ApiService.TOKEN_HEADER_KEY)).toBeFalse();
        expect(response).toBeInstanceOf(HttpResponse);
        verify(cookieServiceMock.remove('apiToken', anything())).once();
      })
    );

    it('should keep a replacing apiToken and retry the request without it when a replaced apiToken is rejected', fakeAsync(() => {
      apiTokenService.setApiToken(accessToken, undefined, initialApiTokenCookie.apiToken);
      const requests: HttpRequest<unknown>[] = [];
      const next: HttpHandler = {
        handle: request => {
          requests.push(request);
          if (requests.length === 1) {
            // e.g. a login or a token refresh replaces the apiToken while the request is pending
            apiTokenService.setApiToken('new@apiToken', undefined, 'new@refreshToken');
            return throwError(
              () => new HttpErrorResponse({ status: 401, error: 'Unauthorized (Verification of token failed.)' })
            );
          }
          return of(new HttpResponse({ status: 200 }));
        },
      };
      let vanished = false;
      apiTokenService.getCookieVanishes$().subscribe(() => (vanished = true));

      apiTokenService.intercept(new HttpRequest('GET', 'https://icm/configurations'), next).subscribe(noop);
      tick(500);

      expect(requests[1].headers.has(ApiService.TOKEN_HEADER_KEY)).toBeFalse();
      expect(vanished).toBeFalse();
      verify(cookieServiceMock.remove('apiToken', anything())).never();
    }));

    describe('on a failed token refresh', () => {
      let requests: HttpRequest<unknown>[];

      const refresh$ = (refreshToken: string, status: number, error = 'Unauthorized') => {
        requests = [];
        const next: HttpHandler = {
          handle: request => {
            requests.push(request);
            return throwError(() => new HttpErrorResponse({ status, error }));
          },
        };
        const body = new HttpParams().set('grant_type', 'refresh_token').set('refresh_token', refreshToken);
        return apiTokenService.intercept(new HttpRequest('POST', 'https://icm/token', body), next);
      };

      it.each([400, 401])(
        'should remove the apiToken cookie when the ICM rejects its refresh token with %s',
        (status, done) => {
          refresh$(initialApiTokenCookie.apiToken, status).subscribe({
            error: () => {
              verify(cookieServiceMock.remove('apiToken', anything())).once();
              done();
            },
          });
        }
      );

      it('should remove the apiToken cookie without a retry when the ICM rejects its refresh token with an authentication token error', done => {
        refresh$(initialApiTokenCookie.apiToken, 401, 'Unauthorized ([none] Error when decrypting token)').subscribe({
          error: () => {
            expect(requests).toHaveLength(1);
            verify(cookieServiceMock.remove('apiToken', anything())).once();
            done();
          },
        });
      });

      it('should keep the apiToken cookie on server errors', done => {
        refresh$(initialApiTokenCookie.apiToken, 503).subscribe({
          error: () => {
            verify(cookieServiceMock.remove('apiToken', anything())).never();
            done();
          },
        });
      });

      it('should keep the apiToken cookie when another token is rejected', done => {
        refresh$('other@refreshToken', 401).subscribe({
          error: () => {
            verify(cookieServiceMock.remove('apiToken', anything())).never();
            done();
          },
        });
      });
    });
  });

  describe('discardApiToken', () => {
    beforeEach(() => {
      when(cookieServiceMock.get('apiToken')).thenReturn(JSON.stringify(initialApiTokenCookie));
      injectServices();
    });

    it('should remove the apiToken and the apiToken cookie', done => {
      apiTokenService.discardApiToken();

      verify(cookieServiceMock.remove('apiToken', anything())).once();
      apiTokenService.getApiToken$().subscribe(apiToken => {
        expect(apiToken).toBeUndefined();
        done();
      });
    });

    it('should not restore the discarded session', done => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      apiTokenService.discardApiToken();

      apiTokenService.restore$().subscribe(restored => {
        expect(restored).toBeTrue();
        expect(dispatchSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
