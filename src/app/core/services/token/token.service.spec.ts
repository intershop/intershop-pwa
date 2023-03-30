import { TestBed } from '@angular/core/testing';
import { OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { firstValueFrom, of } from 'rxjs';
import { anyString, anything, instance, mock, spy, verify, when } from 'ts-mockito';

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

  when(instanceCreators.getOAuthServiceInstance(anything())).thenReturn(instance(oAuthService));

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
});
