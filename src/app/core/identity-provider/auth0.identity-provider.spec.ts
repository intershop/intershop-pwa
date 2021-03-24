import { APP_BASE_HREF } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { anything, capture, instance, mock, resetCalls, spy, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { UserData } from 'ish-core/models/user/user.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { getSsoRegistrationCancelled, getSsoRegistrationRegistered } from 'ish-core/store/customer/sso-registration';
import { getLoggedInCustomer, getUserAuthorized, getUserLoading } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { Auth0Config, Auth0IdentityProvider } from './auth0.identity-provider';

@Component({ template: 'dummy' })
class DummyComponent {}

const idToken = 'abc123';

const userData: UserData = {
  firstName: 'Bob',
  lastName: 'Bobson',
  email: 'bob@bobson.com',
  login: 'bob@bobson.com',
};

const auth0Config: Auth0Config = {
  type: 'auth0',
  domain: 'domain',
  clientID: 'clientID',
};

describe('Auth0 Identity Provider', () => {
  const oAuthService = mock(OAuthService);
  const apiService = mock(ApiService);
  const apiTokenService = mock(ApiTokenService);
  let auth0IdentityProvider: Auth0IdentityProvider;
  let store$: MockStore;
  let storeSpy$: MockStore;
  let router: Router;
  const baseHref = 'baseHref';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'register', component: DummyComponent },
          { path: 'account', component: DummyComponent },
          { path: 'logout', component: DummyComponent },
        ]),
      ],
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: OAuthService, useFactory: () => instance(oAuthService) },
        { provide: APP_BASE_HREF, useValue: baseHref },
        provideMockStore(),
      ],
    }).compileComponents();

    auth0IdentityProvider = TestBed.inject(Auth0IdentityProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
    storeSpy$ = spy(store$);
  });

  beforeEach(() => {
    when(apiTokenService.restore$(anything())).thenReturn(of(true));
    when(oAuthService.getIdToken()).thenReturn(idToken);
    when(oAuthService.loadDiscoveryDocumentAndTryLogin()).thenReturn(
      new Promise((res, _) => {
        res(true);
      })
    );
    when(oAuthService.state).thenReturn(undefined);
    when(apiService.post(anything(), anything())).thenReturn(of(userData));
  });

  describe('init', () => {
    beforeEach(() => {
      resetCalls(apiService);
      resetCalls(apiTokenService);
      store$.overrideSelector(getLoggedInCustomer, undefined as Customer);
      store$.overrideSelector(getUserLoading, true);
      store$.overrideSelector(getSsoRegistrationRegistered, false);
      store$.overrideSelector(getUserAuthorized, false);
      store$.overrideSelector(getSsoRegistrationCancelled, false);
    });

    it('should call processtoken api and dispatch user loading action on startup', fakeAsync(() => {
      auth0IdentityProvider.init(auth0Config);
      tick(500);
      verify(apiService.post(anything(), anything())).once();
      expect(capture(storeSpy$.dispatch).first()).toMatchInlineSnapshot(`[User] Load User by API Token`);
      verify(apiTokenService.removeApiToken()).never();
    }));

    it('should navigate to registration page after successful customer creation and user loading', fakeAsync(() => {
      store$.overrideSelector(getUserLoading, false);

      auth0IdentityProvider.init(auth0Config);
      tick(500);
      expect(router.url).toContain('/register');
      verify(apiTokenService.removeApiToken()).never();
    }));

    it('should reload user by api token after registration form was submitted', fakeAsync(() => {
      store$.overrideSelector(getUserLoading, false);
      store$.overrideSelector(getSsoRegistrationRegistered, true);

      auth0IdentityProvider.init(auth0Config);
      tick(500);

      verify(storeSpy$.dispatch(anything())).twice();
      verify(apiTokenService.removeApiToken()).never();
    }));

    it('should not reload user and navigate to logout after registration form was cancelled', fakeAsync(() => {
      store$.overrideSelector(getUserLoading, false);
      store$.overrideSelector(getSsoRegistrationCancelled, true);

      auth0IdentityProvider.init(auth0Config);
      tick(500);

      verify(storeSpy$.dispatch(anything())).once();
      expect(router.url).toContain('/logout');
      verify(apiTokenService.removeApiToken()).never();
    }));

    it('should remove apiToken and navigate to account page after successful registration', fakeAsync(() => {
      store$.overrideSelector(getUserLoading, false);
      store$.overrideSelector(getSsoRegistrationRegistered, true);
      store$.overrideSelector(getUserAuthorized, true);

      auth0IdentityProvider.init(auth0Config);
      tick(500);
      verify(apiTokenService.removeApiToken()).once();
      expect(router.url).toContain('/account');
    }));

    it('should sign in user without rerouting to registration page if customer exists', fakeAsync(() => {
      store$.overrideSelector(getLoggedInCustomer, ({
        customerNo: '4711',
        isBusinessCustomer: true,
      } as Customer) as Customer);
      store$.overrideSelector(getUserLoading, false);
      store$.overrideSelector(getUserAuthorized, true);

      auth0IdentityProvider.init(auth0Config);
      tick(500);

      verify(storeSpy$.dispatch(anything())).once();
      verify(apiTokenService.removeApiToken()).once();
      expect(router.url).not.toContain('/account');
    }));
  });
});
