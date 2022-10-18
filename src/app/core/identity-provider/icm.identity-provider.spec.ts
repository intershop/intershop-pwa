import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { anything, instance, mock, resetCalls, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { OAuthConfigurationService } from 'ish-core/utils/oauth-configuration/oauth-configuration.service';

import { ICMIdentityProvider } from './icm.identity-provider';

describe('Icm Identity Provider', () => {
  const apiTokenService = mock(ApiTokenService);
  const accountFacade = mock(AccountFacade);
  const oAuthConfigurationService = mock(OAuthConfigurationService);

  let icmIdentityProvider: ICMIdentityProvider;
  let store$: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },

        { provide: OAuthConfigurationService, useFactory: () => instance(oAuthConfigurationService) },
        { provide: OAuthService, useFactory: () => instance(mock(OAuthService)) },

        provideMockStore(),
      ],
    }).compileComponents();

    icmIdentityProvider = TestBed.inject(ICMIdentityProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    when(apiTokenService.restore$()).thenReturn(of(true));
    when(apiTokenService.cookieVanishes$).thenReturn(new Subject());
    when(oAuthConfigurationService.config$).thenReturn(new BehaviorSubject({}));

    resetCalls(apiTokenService);
    resetCalls(accountFacade);

    window.sessionStorage.clear();
  });

  describe('init', () => {
    it('should restore apiToken on startup', () => {
      icmIdentityProvider.init();
      verify(apiTokenService.restore$()).once();
      verify(apiTokenService.removeApiToken()).never();
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
      const routerSpy = spy(router);

      const logoutTrigger$ = icmIdentityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        verify(routerSpy.parseUrl('/home')).once();
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
