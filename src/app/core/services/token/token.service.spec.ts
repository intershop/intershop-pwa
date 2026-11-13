import { Injector } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OAuthInfoEvent, OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { Subject, firstValueFrom, noop, of } from 'rxjs';
import { anyString, anything, instance, mock, resetCalls, spy, verify, when } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { InstanceCreators } from 'ish-core/utils/instance-creators';

import { TokenService } from './token.service';

describe('Token Service', () => {
  let tokenService: TokenService;
  const apiService = mock(ApiService);
  const oAuthService = mock(OAuthService);
  const instanceCreators = spy(InstanceCreators);

  when(apiService.constructUrlForPath('token', anything())).thenReturn(of('https://icm-test-url.com/token'));

  when(oAuthService.fetchTokenUsingGrant(anyString(), anything(), anything())).thenReturn(
    firstValueFrom(of({ access_token: 'access-token', expires_in: 123456 } as TokenResponse))
  );
  when(oAuthService.refreshToken()).thenResolve();
  when(oAuthService.getAccessToken()).thenReturn('access-token');
  when(oAuthService.getAccessTokenExpiration()).thenReturn(123456);
  when(oAuthService.configure(anything())).thenResolve();
  when(oAuthService.events).thenReturn(of(undefined));

  when(instanceCreators.getOAuthServiceInstance(anything(), anything())).thenReturn(instance(oAuthService));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ApiService,
          useFactory: () => instance(apiService),
        },
        { provide: ApiTokenService, useFactory: () => instance(mock(ApiTokenService)) },
      ],
    }).compileComponents();

    tokenService = TestBed.inject(TokenService);
  });

  describe('constructor', () => {
    it('should configure oAuthService', () => {
      verify(oAuthService.configure(anything())).once();
    });
  });

  describe('fetchToken', () => {
    it('should call the fetchTokenUsingGrant method', done => {
      tokenService.fetchToken('anonymous').subscribe(() => {
        verify(oAuthService.fetchTokenUsingGrant(anyString(), anything(), anything())).once();
        done();
      });
    });
  });

  describe('logOut', () => {
    it('should remove the stored tokens and stop their refresh timers', () => {
      tokenService.logOut();

      verify(oAuthService.logOut(true)).once();
      verify(oAuthService.stopAutomaticRefresh()).once();
    });
  });

  describe('refresh token mechanism', () => {
    let apiTokenService: ApiTokenService;

    // the ICMErrorMapperInterceptor maps the error of the token refresh request
    const httpError = (status: number): Error & HttpError => ({
      name: 'HttpErrorResponse',
      status,
      message: `Http failure response: ${status}`,
    });

    // the service subscribes to the OAuth events on creation, so each test creates it after setting up its mocks
    const createTokenService = () =>
      new TokenService(instance(apiService), instance(apiTokenService), TestBed.inject(Injector));

    beforeEach(() => {
      apiTokenService = mock(ApiTokenService);
      resetCalls(oAuthService);
      when(oAuthService.events).thenReturn(of(new OAuthInfoEvent('token_expires', 'access_token')));
      jest.spyOn(console, 'warn').mockImplementation(noop);
    });

    afterEach(() => {
      when(oAuthService.refreshToken()).thenResolve();
      when(oAuthService.getAccessToken()).thenReturn('access-token');
      when(oAuthService.events).thenReturn(of(undefined));
    });

    it('should invalidate the apiToken if the token refresh is rejected', fakeAsync(() => {
      when(oAuthService.refreshToken()).thenReject(httpError(400));

      createTokenService();
      tick();

      verify(apiTokenService.invalidateApiToken('access-token')).once();
      verify(apiTokenService.removeApiToken()).never();
    }));

    it('should invalidate the access token of the rejected refresh attempt only', fakeAsync(() => {
      when(oAuthService.getAccessToken()).thenReturn('old-access-token').thenReturn('new-access-token');
      when(oAuthService.refreshToken()).thenReject(httpError(503)).thenReject(httpError(400));

      createTokenService();
      tick(60_000);

      verify(apiTokenService.invalidateApiToken('new-access-token')).once();
      verify(apiTokenService.invalidateApiToken('old-access-token')).never();
    }));

    it('should keep the session without retry if the token refresh fails for other reasons', fakeAsync(() => {
      when(oAuthService.refreshToken()).thenReject(httpError(403));

      createTokenService();
      tick(180_000);

      verify(oAuthService.refreshToken()).once();
      verify(apiTokenService.invalidateApiToken(anything())).never();
    }));

    it('should retry the token refresh and keep the session on temporary errors', fakeAsync(() => {
      when(oAuthService.refreshToken()).thenReject(httpError(503)).thenResolve();

      createTokenService();
      tick(60_000);

      verify(oAuthService.refreshToken()).twice();
      verify(apiTokenService.invalidateApiToken(anything())).never();
    }));

    it('should keep the session if the token refresh fails temporarily after all retries', fakeAsync(() => {
      when(oAuthService.refreshToken()).thenReject(httpError(0));

      createTokenService();
      tick(180_000);

      verify(oAuthService.refreshToken()).times(4);
      verify(apiTokenService.invalidateApiToken(anything())).never();
    }));

    it('should cancel a pending retry of the token refresh on logout', fakeAsync(() => {
      const events$ = new Subject<OAuthInfoEvent>();
      when(oAuthService.events).thenReturn(events$);
      when(oAuthService.refreshToken()).thenReject(httpError(503));

      createTokenService();
      events$.next(new OAuthInfoEvent('token_expires', 'access_token'));
      tick();
      events$.next(new OAuthInfoEvent('logout'));
      tick(60_000);

      verify(oAuthService.refreshToken()).once();
      verify(apiTokenService.invalidateApiToken(anything())).never();
    }));
  });
});
