import { Injectable } from '@angular/core';
import { AuthConfig, OAuthInfoEvent, OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, filter, from, map, switchMap, take, tap } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({
  providedIn: 'root',
})
export class OAuthConfigurationService {
  config$ = new BehaviorSubject<AuthConfig>(undefined);

  constructor(private apiService: ApiService, private oAuthService: OAuthService) {}

  /**
   * load an AuthConfig configuration object with specified tokenEndpoint
   */
  get loadConfig$(): Observable<AuthConfig> {
    return this.apiService
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
        })),
        tap(config => this.config$.next(config))
      );
  }

  /**
   * Refresh existing tokens, when token is about to expire
   *
   * @returns {TokenResponse} updated tokens
   */
  setupRefreshTokenMechanism$(): Observable<TokenResponse> {
    return this.oAuthService.events.pipe(
      filter(
        event => event instanceof OAuthInfoEvent && event.type === 'token_expires' && event.info === 'access_token'
      ),
      switchMap(() => from(this.oAuthService.refreshToken()))
    );
  }
}
