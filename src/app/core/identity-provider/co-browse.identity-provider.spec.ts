import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Params, Router, UrlTree, convertToParamMap } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, Observable, Subject, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CoBrowseIdentityProvider } from './co-browse.identity-provider';

function getSnapshot(queryParams: Params): ActivatedRouteSnapshot {
  return {
    queryParamMap: convertToParamMap(queryParams),
  } as ActivatedRouteSnapshot;
}

describe('Co Browse Identity Provider', () => {
  const apiTokenService = mock(ApiTokenService);
  const appFacade = mock(AppFacade);
  const accountFacade = mock(AccountFacade);
  const checkoutFacade = mock(CheckoutFacade);

  let identityProvider: CoBrowseIdentityProvider;
  let store$: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        provideMockStore(),
      ],
    }).compileComponents();

    identityProvider = TestBed.inject(CoBrowseIdentityProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    when(apiTokenService.restore$(anything())).thenReturn(of(true));
    when(apiTokenService.cookieVanishes$).thenReturn(new Subject());
    when(checkoutFacade.basket$).thenReturn(EMPTY);

    resetCalls(apiTokenService);
    resetCalls(appFacade);
    resetCalls(accountFacade);
    resetCalls(checkoutFacade);

    window.sessionStorage.clear();
  });

  describe('init', () => {
    it('should restore apiToken on startup', () => {
      identityProvider.init();
      verify(apiTokenService.restore$(anything())).once();
      verify(apiTokenService.removeApiToken()).never();
    });

    it('should add basket-id to session storage, when basket is available', () => {
      when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
      identityProvider.init();
      expect(window.sessionStorage.getItem('basket-id')).toEqual(BasketMockData.getBasket().id);
    });
  });

  describe('triggerLogout', () => {
    beforeEach(() => {
      when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
      when(accountFacade.isLoggedIn$).thenReturn(of(false));
      store$.overrideSelector(selectQueryParam(anything()), undefined);
      identityProvider.init();
    });

    it('should remove api token and basket-id on logout', done => {
      expect(window.sessionStorage.getItem('basket-id')).toEqual(BasketMockData.getBasket().id);

      const logoutTrigger$ = identityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        expect(window.sessionStorage.getItem('basket-id')).toBeNull();
        verify(accountFacade.logoutUser()).once();
        done();
      });
    });

    it('should return to home page per default on subscribe', done => {
      const routerSpy = jest.spyOn(router, 'parseUrl');

      const logoutTrigger$ = identityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        expect(routerSpy).toHaveBeenCalledWith('/home');
        done();
      });
    });
  });

  describe('triggerLogin', () => {
    let queryParams = {};

    beforeEach(() => {
      identityProvider.init();
      when(accountFacade.userError$).thenReturn(timer(Infinity).pipe(switchMap(() => EMPTY)));
      when(accountFacade.isLoggedIn$).thenReturn(of(true));
    });

    it('should throw an business error without query params on login', () => {
      const result$ = identityProvider.triggerLogin(getSnapshot(queryParams));

      verify(appFacade.setBusinessError('cobrowse.error.missing.parameter')).once();
      expect(result$).toBeFalsy();
    });

    describe('with access-token', () => {
      const accessToken = 'login-access-token';

      beforeEach(() => {
        queryParams = { 'access-token': accessToken };
      });

      it('should trigger loginUserWithToken method on login', done => {
        const login$ = identityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<boolean | UrlTree>;

        login$.subscribe(() => {
          verify(accountFacade.loginUserWithToken(accessToken)).once();
          done();
        });
      });
    });
  });
});
