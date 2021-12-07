import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Params, Router, UrlTree, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, Observable, Subject, noop, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { anyString, anything, capture, instance, mock, resetCalls, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ApiService } from 'ish-core/services/api/api.service';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { PunchoutSession } from '../models/punchout-session/punchout-session.model';
import { PunchoutService } from '../services/punchout/punchout.service';

import { PunchoutIdentityProvider } from './punchout-identity-provider';

@Component({ template: 'dummy' })
class DummyComponent {}

type ApiTokenCookieType = 'user' | 'basket' | 'order';

function getSnapshot(queryParams: Params): ActivatedRouteSnapshot {
  return {
    queryParamMap: convertToParamMap(queryParams),
  } as ActivatedRouteSnapshot;
}

describe('Punchout Identity Provider', () => {
  const punchoutService = mock(PunchoutService);
  const apiService = mock(ApiService);
  const apiTokenService = mock(ApiTokenService);
  const appFacade = mock(AppFacade);
  const accountFacade = mock(AccountFacade);
  const checkoutFacade = mock(CheckoutFacade);
  const cookiesService = mock(CookiesService);

  let punchoutIdentityProvider: PunchoutIdentityProvider;
  let store$: MockStore;
  let storeSpy$: MockStore;
  let router: Router;
  let cookieVanishes$: Subject<ApiTokenCookieType>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent },
          { path: 'logout', component: DummyComponent },
          { path: 'error', component: DummyComponent },
        ]),
      ],
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: CookiesService, useFactory: () => instance(cookiesService) },
        provideMockStore(),
      ],
    }).compileComponents();

    punchoutIdentityProvider = TestBed.inject(PunchoutIdentityProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
    storeSpy$ = spy(store$);
  });

  beforeEach(() => {
    cookieVanishes$ = new Subject<ApiTokenCookieType>();
    when(apiTokenService.restore$(anything())).thenReturn(of(true));
    when(checkoutFacade.basket$).thenReturn(EMPTY);
    when(apiTokenService.cookieVanishes$).thenReturn(cookieVanishes$);

    resetCalls(apiService);
    resetCalls(apiTokenService);
    resetCalls(punchoutService);
    resetCalls(appFacade);
    resetCalls(accountFacade);
    resetCalls(checkoutFacade);
    resetCalls(cookiesService);

    window.sessionStorage.clear();
  });

  describe('init', () => {
    it('should restore apiToken on startup', () => {
      punchoutIdentityProvider.init();
      verify(apiTokenService.restore$(anything())).once();
      verify(apiTokenService.removeApiToken()).never();
    });

    it('should add basket-id to session storage, when basket is available', () => {
      when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
      punchoutIdentityProvider.init();
      expect(window.sessionStorage.getItem('basket-id')).toEqual(BasketMockData.getBasket().id);
    });
  });

  describe('triggerLogout', () => {
    beforeEach(() => {
      when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
      store$.overrideSelector(selectQueryParam(anything()), undefined);
      punchoutIdentityProvider.init();
    });

    it('should remove api token and basket-id on logout', () => {
      expect(window.sessionStorage.getItem('basket-id')).toEqual(BasketMockData.getBasket().id);

      punchoutIdentityProvider.triggerLogout();

      expect(window.sessionStorage.getItem('basket-id')).toBeNull();
      expect(capture(storeSpy$.dispatch).first()).toMatchInlineSnapshot(`[User] Logout User`);
      verify(apiTokenService.removeApiToken()).once();
    });

    it('should return to home page per default on subscribe', done => {
      const routerSpy = spy(router);

      const logoutTrigger$ = punchoutIdentityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        verify(routerSpy.parseUrl('/home')).once();
        done();
      });
    });
  });
  describe('triggerLogin', () => {
    let routerSpy: Router;
    let queryParams = {};

    beforeEach(() => {
      routerSpy = spy(router);
      punchoutIdentityProvider.init();
      when(accountFacade.userError$).thenReturn(EMPTY);
      when(accountFacade.isLoggedIn$).thenReturn(EMPTY);
    });

    it('should throw an business error without query params on login', () => {
      const result$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams));

      verify(appFacade.setBusinessError('punchout.error.missing.parameters')).once();
      expect(result$).toBeFalsy();
    });

    describe('with access-token', () => {
      const accessToken = 'login-access-token';

      beforeEach(() => {
        queryParams = { sid: 'sid', 'access-token': accessToken };
      });

      it('should trigger loginUserWithToken method on login', () => {
        punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams));
        verify(accountFacade.loginUserWithToken(accessToken)).once();
      });
    });

    describe('with username and password', () => {
      const username = 'username';
      const password = 'password';

      beforeEach(() => {
        queryParams = { HOOK_URL: 'url', USERNAME: username, PASSWORD: password };
      });

      it('should trigger loginUser method on login', () => {
        punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams));
        verify(accountFacade.loginUser(anything())).once();
      });
    });
    describe('race', () => {
      describe('isLoggedIn$ emits first', () => {
        beforeEach(() => {
          // userError$ first
          when(accountFacade.userError$).thenReturn(EMPTY.pipe(delay(Infinity)));
          when(accountFacade.isLoggedIn$).thenReturn(of(true));
        });

        describe('with cxmlPunchoutUser', () => {
          beforeEach(() => {
            queryParams = { sid: 'sid', 'access-token': 'accessToken' };

            when(punchoutService.getCxmlPunchoutSession(anything())).thenReturn(
              of({ returnURL: 'home', basketId: 'basket-id' } as PunchoutSession)
            );
          });

          it('should set cookies, load basket basket and return to homepage', fakeAsync(() => {
            const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
              boolean | UrlTree
            >;
            login$.subscribe(() => {
              verify(cookiesService.put('punchout_SID', 'sid', anything())).once();
              verify(cookiesService.put('punchout_ReturnURL', 'home', anything())).once();
              verify(cookiesService.put('punchout_BasketID', 'basket-id', anything())).once();
            });

            tick(500);
            verify(checkoutFacade.loadBasketWithId('basket-id')).once();
            verify(routerSpy.parseUrl('/home')).once();
          }));
        });

        describe('with oci punchout user', () => {
          beforeEach(() => {
            queryParams = { HOOK_URL: 'url', USERNAME: 'username', PASSWORD: 'password' };
          });

          it('should set cookie and create basket on login', done => {
            const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
              boolean | UrlTree
            >;
            login$.subscribe(() => {
              verify(cookiesService.put('punchout_HookURL', 'url', anything())).once();
              verify(checkoutFacade.createBasket()).once();
              verify(routerSpy.parseUrl('/home')).once();
              done();
            });
          });

          it('should reload basket when basket is saved in session storage', done => {
            window.sessionStorage.setItem('basket-id', 'basket-id');
            const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
              boolean | UrlTree
            >;
            login$.subscribe(() => {
              verify(checkoutFacade.loadBasketWithId('basket-id')).once();
              done();
            });
          });

          describe('requests product details', () => {
            const productId = 'product-123';
            beforeEach(() => {
              queryParams = { ...queryParams, FUNCTION: 'DETAIL', PRODUCTID: productId };
            });

            it('should route to product details page', done => {
              const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
                boolean | UrlTree
              >;
              login$.subscribe(() => {
                verify(routerSpy.parseUrl(`/product/${productId}`)).once();
                done();
              });
            });
          });

          describe('requests validation of product', () => {
            const productId = 'product-123';
            beforeEach(() => {
              queryParams = { ...queryParams, FUNCTION: 'VALIDATE', PRODUCTID: productId };
              when(punchoutService.getOciPunchoutProductData(anyString(), anyString())).thenReturn(of([]));
            });

            it('should get product data and submit data to oci punchout system', done => {
              const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
                boolean | UrlTree
              >;
              login$.subscribe(() => {
                verify(punchoutService.getOciPunchoutProductData(productId, '1')).once();
                verify(punchoutService.submitOciPunchoutData(anything())).once();
                done();
              });
            });

            it('should set quantity of requested punchout product data when value is available', done => {
              queryParams = { ...queryParams, QUANTITY: '42' };
              const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
                boolean | UrlTree
              >;
              login$.subscribe(() => {
                verify(punchoutService.getOciPunchoutProductData(productId, '42')).once();
                verify(punchoutService.submitOciPunchoutData(anything())).once();
                done();
              });
            });
          });

          describe('requests background requests', () => {
            const search = 'product-123';
            beforeEach(() => {
              queryParams = { ...queryParams, FUNCTION: 'BACKGROUND_SEARCH', SEARCHSTRING: search };
              when(punchoutService.getOciPunchoutSearchData(anyString())).thenReturn(of([]));
            });

            it('should get punchout product data from search and create form without submit', done => {
              const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
                boolean | UrlTree
              >;
              login$.subscribe(() => {
                verify(punchoutService.getOciPunchoutSearchData(search)).once();
                verify(punchoutService.submitOciPunchoutData(anything(), false)).once();
                done();
              });
            });
          });
        });

        describe('throws error after successful authentication', () => {
          const error = {
            message: 'cXML punchout session error',
          } as Error;

          beforeEach(() => {
            queryParams = { sid: 'sid', 'access-token': 'accessToken' };
            when(punchoutService.getCxmlPunchoutSession(anyString())).thenThrow(error);
            when(accountFacade.userLoading$).thenReturn(of(false));
          });

          it('should logout user, remove api token and route to error page', fakeAsync(() => {
            const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
              boolean | UrlTree
            >;
            login$.subscribe(noop);
            tick(0);
            verify(accountFacade.logoutUser()).once();
            verify(apiTokenService.removeApiToken()).once();
            verify(appFacade.setBusinessError(error.toString()));
            verify(routerSpy.parseUrl('/error')).once();
          }));
        });
      });

      describe('userError$ emits first', () => {
        beforeEach(() => {
          when(accountFacade.userError$).thenReturn(of(makeHttpError({ message: 'userError' })));
          when(accountFacade.isLoggedIn$).thenReturn(EMPTY.pipe(delay(Infinity)));
          queryParams = { sid: 'sid', 'access-token': 'accessToken' };
        });

        it('should set business error and return to error page', done => {
          const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
            boolean | UrlTree
          >;
          login$.subscribe(() => {
            verify(appFacade.setBusinessError(anything())).once();
            verify(routerSpy.parseUrl('/error')).once();
            done();
          });
        });
      });
    });
  });
});
