import { TestBed } from '@angular/core/testing';
import { AuthConfig, OAuthInfoEvent, OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { combineLatest, lastValueFrom, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { OAuthConfigurationService } from './oauth-configuration.service';

describe('Oauth Configuration Service', () => {
  const TOKEN_ENDPOINT = 'http://test-icm-url.de/token';

  const config: AuthConfig = {
    tokenEndpoint: TOKEN_ENDPOINT,
    requireHttps: false,
  };

  const apiService = mock(ApiService);
  const oAuthService = mock(OAuthService);

  let component: OAuthConfigurationService;

  beforeEach(() => {
    when(apiService.constructUrlForPath('token', anything())).thenReturn(of(TOKEN_ENDPOINT));
    const infoEvent = Object.create(OAuthInfoEvent.prototype);
    when(oAuthService.events).thenReturn(
      // eslint-disable-next-line ban/ban
      of<OAuthInfoEvent>(Object.assign(infoEvent, { type: 'token_expires', info: 'access_token' }))
    );
    when(oAuthService.refreshToken()).thenReturn(
      lastValueFrom(of({ access_token: 'access', expires_in: 10, refresh_token: 'refresh' } as TokenResponse))
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: OAuthService, useFactory: () => instance(oAuthService) },
      ],
    }).compileComponents();

    component = TestBed.inject(OAuthConfigurationService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('loadConfig$', () => {
    it('should calculate correct configuration object', done => {
      component.loadConfig$.subscribe(authConf => {
        verify(apiService.constructUrlForPath('token', anything())).once();
        expect(authConf).toEqual(config);
        done();
      });
    });
  });

  describe('config$', () => {
    it('should contain the calculated authConfig after successful loadConfig$ action', done => {
      combineLatest([component.loadConfig$, component.config$]).subscribe(([, authConf]) => {
        expect(authConf).toEqual(config);
        done();
      });
    });
  });

  describe('setupRefreshTokenMechanism$', () => {
    it('should refresh access token, when access token is about to expire', done => {
      component.setupRefreshTokenMechanism$().subscribe(() => {
        verify(oAuthService.refreshToken()).once();
        done();
      });
    });
  });
});
