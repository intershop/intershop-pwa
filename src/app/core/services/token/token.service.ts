import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthConfig, OAuthInfoEvent, OAuthService, OAuthSuccessEvent, TokenResponse } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, filter, first, from, map, noop, switchMap, take } from 'rxjs';

import { FetchTokenOptions, GrantType } from 'ish-core/models/token/token.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { InstanceCreators } from 'ish-core/utils/instance-creators';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private oAuthService: OAuthService;
  private serviceConfigured$ = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService, private apiTokenService: ApiTokenService, parent: Injector) {
    this.oAuthService = InstanceCreators.getOAuthServiceInstance(parent);

    this.apiService
      .constructUrlForPath('token', {
        sendCurrency: true,
        sendLocale: true,
      })
      .pipe(
        whenTruthy(),
        filter(url => !url.startsWith('/')), // url should not be relative
        take(1),
        map<string, AuthConfig>(url => ({
          tokenEndpoint: url,
          requireHttps: url.startsWith('https'),
          timeoutFactor: 0.5,
        }))
      )
      .subscribe(conf => {
        this.oAuthService.configure(conf);
        this.serviceConfigured$.next(true);
      });

    this.setApiTokenCookie$().subscribe(noop);
    this.setupRefreshTokenMechanism$().subscribe(noop);
  }

  /**
   * Fetches a new user token. Based on the grantType the user has to apply certain token options to the method.
   *
   * @param grantType   The given type ('anonymous', 'password', 'client_credentials', 'refresh_token') is used to specify, how the user token should be fetched.
   */
  fetchToken<T extends 'anonymous'>(grantType: T): Observable<TokenResponse>;
  fetchToken<T extends GrantType, R extends FetchTokenOptions<T>>(grantType: T, options: R): Observable<TokenResponse>;
  fetchToken<T extends GrantType, R extends FetchTokenOptions<T>>(
    grantType: T,
    options?: R
  ): Observable<TokenResponse> {
    return this.serviceConfigured$.pipe(
      whenTruthy(),
      first(),
      switchMap(() =>
        from(
          this.oAuthService?.fetchTokenUsingGrant(
            grantType,
            options ?? {},
            new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded' })
          )
        )
      )
    );
  }

  logOut() {
    this.oAuthService.logOut(true);
  }

  /**
   * Refresh existing tokens, when token is about to expire
   *
   * @returns {TokenResponse} updated tokens
   */
  private setupRefreshTokenMechanism$(): Observable<TokenResponse> {
    return this.serviceConfigured$.pipe(
      whenTruthy(),
      first(),
      switchMap(() =>
        this.oAuthService.events.pipe(
          filter(
            event => event instanceof OAuthInfoEvent && event.type === 'token_expires' && event.info === 'access_token'
          ),
          switchMap(() => from(this.oAuthService.refreshToken()))
        )
      )
    );
  }

  private setApiTokenCookie$() {
    return this.oAuthService.events.pipe(
      filter(event => event instanceof OAuthSuccessEvent && event.type === 'token_received'),
      map(() =>
        this.apiTokenService.setApiToken(this.oAuthService.getAccessToken(), {
          expires: new Date(this.oAuthService.getAccessTokenExpiration()),
        })
      )
    );
  }
}
