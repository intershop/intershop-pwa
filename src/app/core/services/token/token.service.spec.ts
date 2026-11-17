import { Injector } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OAuthInfoEvent, OAuthService, OAuthSuccessEvent, TokenResponse } from 'angular-oauth2-oidc';
import { firstValueFrom, noop, of } from 'rxjs';
import { anyString, anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

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
    afterEach(() => {
      when(oAuthService.refreshToken()).thenResolve();
      when(oAuthService.events).thenReturn(of(undefined));
    });

    it('should set the apiToken with its refresh token and the cookie expiry of the refresh token', () => {
      const apiTokenService = mock(ApiTokenService);
      when(oAuthService.events).thenReturn(of(new OAuthSuccessEvent('token_received')));
      when(oAuthService.getRefreshToken()).thenReturn('refresh-token');
      when(oAuthService.getCustomTokenResponseProperty('refresh_expires_in')).thenReturn(3600);
      jest.spyOn(Date, 'now').mockReturnValue(1000);

      expect(new TokenService(instance(apiService), instance(apiTokenService), TestBed.inject(Injector))).toBeTruthy();

      verify(apiTokenService.setApiToken('access-token', anything(), 'refresh-token')).once();
      const [, options] = capture(apiTokenService.setApiToken).last();
      expect(options.expires).toEqual(new Date(3601000));
    });

    it('should invalidate the apiToken if the token refresh fails', fakeAsync(() => {
      const apiTokenService = mock(ApiTokenService);
      when(oAuthService.events).thenReturn(of(new OAuthInfoEvent('token_expires', 'access_token')));
      when(oAuthService.refreshToken()).thenReject(new Error('refresh failed'));
      jest.spyOn(console, 'warn').mockImplementation(noop);

      expect(new TokenService(instance(apiService), instance(apiTokenService), TestBed.inject(Injector))).toBeTruthy();
      tick();

      verify(apiTokenService.invalidateApiToken()).once();
      verify(apiTokenService.removeApiToken()).never();
    }));
  });
});
