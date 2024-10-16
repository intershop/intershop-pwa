/* eslint-disable etc/no-deprecated */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Params, Router, UrlTree, convertToParamMap } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, Observable, Subject, noop, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { anyString, anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { TokenService } from 'ish-core/services/token/token.service';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { PunchoutSession } from '../models/punchout-session/punchout-session.model';
import { PunchoutService } from '../services/punchout/punchout.service';

import { PunchoutIdentityProvider } from './punchout-identity-provider';

function getSnapshot(queryParams: Params): ActivatedRouteSnapshot {
  return {
    queryParamMap: convertToParamMap(queryParams),
  } as ActivatedRouteSnapshot;
}

describe('Punchout Identity Provider', () => {
  const punchoutService = mock(PunchoutService);
  const apiTokenService = mock(ApiTokenService);
  const appFacade = mock(AppFacade);
  const accountFacade = mock(AccountFacade);
  const checkoutFacade = mock(CheckoutFacade);
  const cookiesService = mock(CookiesService);

  let punchoutIdentityProvider: PunchoutIdentityProvider;
  let store$: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: CookiesService, useFactory: () => instance(cookiesService) },
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
        { provide: TokenService, useFactory: () => instance(mock(TokenService)) },
        provideMockStore(),
      ],
    }).compileComponents();

    punchoutIdentityProvider = TestBed.inject(PunchoutIdentityProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    when(apiTokenService.restore$(anything())).thenReturn(of(true));
    when(apiTokenService.getCookieVanishes$()).thenReturn(new Subject());
    when(checkoutFacade.basket$).thenReturn(EMPTY);

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
      when(accountFacade.isLoggedIn$).thenReturn(of(false));
      store$.overrideSelector(selectQueryParam(anything()), undefined);
      punchoutIdentityProvider.init();
    });

    it('should remove api token and basket-id on logout', done => {
      expect(window.sessionStorage.getItem('basket-id')).toEqual(BasketMockData.getBasket().id);

      const logoutTrigger$ = punchoutIdentityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        expect(window.sessionStorage.getItem('basket-id')).toBeNull();
        verify(accountFacade.logoutUser()).once();
        done();
      });
    });

    it('should return to home page per default on subscribe', done => {
      const routerSpy = jest.spyOn(router, 'parseUrl');

      const logoutTrigger$ = punchoutIdentityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        expect(routerSpy).toHaveBeenCalledWith('/home');
        done();
      });
    });
  });

  describe('triggerLogin', () => {
    let routerSpy: unknown;
    let queryParams = {};

    beforeEach(() => {
      routerSpy = jest.spyOn(router, 'parseUrl');
      punchoutIdentityProvider.init();
      when(accountFacade.userError$).thenReturn(timer(Infinity).pipe(switchMap(() => EMPTY)));
      when(accountFacade.isLoggedIn$).thenReturn(of(true));
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

      it('should trigger loginUserWithToken method on login', done => {
        const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<boolean | UrlTree>;

        login$.subscribe(() => {
          verify(accountFacade.loginUserWithToken(accessToken)).once();
          done();
        });
      });
    });

    describe('with username and password', () => {
      const username = 'username';
      const password = 'password';

      beforeEach(() => {
        queryParams = { HOOK_URL: 'url', USERNAME: username, PASSWORD: password };
      });

      it('should trigger loginUser method on login', done => {
        const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<boolean | UrlTree>;

        login$.subscribe(() => {
          verify(accountFacade.loginUser(anything())).once();
          done();
        });
      });
    });
    describe('race', () => {
      describe('isLoggedIn$ emits first', () => {
        beforeEach(() => {
          // userError$ first
          when(accountFacade.userError$).thenReturn(timer(Infinity).pipe(switchMap(() => EMPTY)));
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
              verify(cookiesService.put('punchout_SID', 'sid')).once();
              verify(cookiesService.put('punchout_ReturnURL', 'home')).once();
              verify(cookiesService.put('punchout_BasketID', 'basket-id')).once();
            });

            tick(500);
            verify(checkoutFacade.loadBasketWithId('basket-id')).once();
            expect(routerSpy).toHaveBeenCalledWith('/home');
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
              verify(cookiesService.put('punchout_HookURL', 'url')).once();
              verify(checkoutFacade.createBasket()).once();
              expect(routerSpy).toHaveBeenCalledWith('/home');
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
                expect(routerSpy).toHaveBeenCalledWith(`/product/${productId}`);
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
            expect(routerSpy).toHaveBeenCalledWith('/error');
          }));
        });
      });

      describe('userError$ emits first', () => {
        beforeEach(() => {
          when(accountFacade.userError$).thenReturn(of(makeHttpError({ message: 'userError' })));
          when(accountFacade.isLoggedIn$).thenReturn(timer(Infinity).pipe(switchMap(() => EMPTY)));
          queryParams = { sid: 'sid', 'access-token': 'accessToken' };
        });

        it('should set business error and return to error page', done => {
          const login$ = punchoutIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
            boolean | UrlTree
          >;
          login$.subscribe(() => {
            verify(appFacade.setBusinessError(anything())).once();
            expect(routerSpy).toHaveBeenCalledWith('/error');
            done();
          });
        });
      });
    });
  });
});
