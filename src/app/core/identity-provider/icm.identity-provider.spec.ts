import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { TokenService } from 'ish-core/services/token/token.service';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { ICMIdentityProvider } from './icm.identity-provider';

describe('Icm Identity Provider', () => {
  const apiTokenService = mock(ApiTokenService);
  const accountFacade = mock(AccountFacade);

  let icmIdentityProvider: ICMIdentityProvider;
  let store$: MockStore;
  let router: Router;
  let cookieVanishes$: Subject<'order' | 'user'>;
  let isLoggedIn$: BehaviorSubject<boolean>;

  beforeEach(() => {
    cookieVanishes$ = new Subject();
    isLoggedIn$ = new BehaviorSubject(false);
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: TokenService, useFactory: () => instance(mock(TokenService)) },
        provideMockStore(),
      ],
    }).compileComponents();

    icmIdentityProvider = TestBed.inject(ICMIdentityProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    when(apiTokenService.restore$()).thenReturn(of(true));
    when(apiTokenService.getCookieVanishes$()).thenReturn(cookieVanishes$);
    when(accountFacade.isLoggedIn$).thenReturn(isLoggedIn$);

    resetCalls(apiTokenService);
    resetCalls(accountFacade);

    sessionStorage.clear();
  });

  describe('init', () => {
    it('should restore apiToken on startup', () => {
      icmIdentityProvider.init();
      verify(apiTokenService.restore$()).once();
      verify(apiTokenService.removeApiToken()).never();
    });
  });

  describe('cookie vanishes', () => {
    let routerSpy: jest.SpyInstance;

    beforeEach(() => {
      routerSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
      icmIdentityProvider.init();
    });

    it('should log out the user and route to the login page when a logged in user loses the session', () => {
      isLoggedIn$.next(true);
      cookieVanishes$.next('user');

      verify(accountFacade.logoutUser(anything())).once();
      expect(routerSpy).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: router.url, messageKey: 'session_timeout' },
      });
    });

    it('should not route to the login page when an anonymous user loses the session', () => {
      isLoggedIn$.next(false);
      cookieVanishes$.next('user');

      verify(accountFacade.logoutUser(anything())).once();
      expect(routerSpy).not.toHaveBeenCalled();
    });
  });

  describe('triggerLogout', () => {
    beforeEach(() => {
      when(accountFacade.isLoggedIn$).thenReturn(of(false));
      store$.overrideSelector(selectQueryParam(anything()), undefined);
      icmIdentityProvider.init();
    });

    it('should remove api token on logout', done => {
      const logoutTrigger$ = icmIdentityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        verify(accountFacade.logoutUser()).once();
        done();
      });
    });

    it('should return to home page', done => {
      const routerSpy = jest.spyOn(router, 'parseUrl');

      const logoutTrigger$ = icmIdentityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        expect(routerSpy).toHaveBeenCalledWith('/home');
        done();
      });
    });
  });

  describe('triggerLogin', () => {
    beforeEach(() => {
      icmIdentityProvider.init();
    });

    it('should always return true without any further functionality', () => {
      expect(icmIdentityProvider.triggerLogin()).toBeTrue();
    });
  });
});
