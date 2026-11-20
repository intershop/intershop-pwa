import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import {
  AuthConfig,
  OAuthInfoEvent,
  OAuthService,
  OAuthStorage,
  OAuthSuccessEvent,
  TokenResponse,
} from 'angular-oauth2-oidc';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  defer,
  filter,
  first,
  from,
  map,
  noop,
  retry,
  switchMap,
  take,
  throwError,
  timer,
} from 'rxjs';

import { HttpErrorHelper } from 'ish-core/models/http-error/http-error.helper';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { FetchTokenOptions, GrantType } from 'ish-core/models/token/token.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { InstanceCreators } from 'ish-core/utils/instance-creators';
import { whenTruthy } from 'ish-core/utils/operators';

const REFRESH_RETRY_COUNT = 3;

const REFRESH_RETRY_DELAY = 60_000;

/**
 * the HTTP status of a token request error, which the ICMErrorMapperInterceptor maps to an HttpError
 */
function httpErrorStatus(error: unknown): number {
  return (error as HttpError)?.name === 'HttpErrorResponse' ? (error as HttpError).status : undefined;
}

/**
 * network and server errors do not indicate an invalid refresh token
 */
function isTemporaryError(error: unknown): boolean {
  const status = httpErrorStatus(error);
  return status === 0 || status >= 500;
}

function storageFactory(): OAuthStorage {
  const prefix = 'icm_' as const;
  if (!SSR) {
    return {
      getItem(key: string): string {
        return localStorage.getItem(`${prefix}${key}`);
      },
      removeItem(key: string): void {
        return localStorage.removeItem(`${prefix}${key}`);
      },
      setItem(key: string, data: string): void {
        return localStorage.setItem(`${prefix}${key}`, data);
      },
    };
  }
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private oAuthService: OAuthService;
  private serviceConfigured$ = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService,
    private apiTokenService: ApiTokenService,
    parent: Injector
  ) {
    this.oAuthService = InstanceCreators.getOAuthServiceInstance(parent, storageFactory);

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
    // the expiration timer of removed tokens must not trigger a token refresh
    this.oAuthService.stopAutomaticRefresh();
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
            event =>
              event instanceof OAuthInfoEvent &&
              ((event.type === 'token_expires' && event.info === 'access_token') || event.type === 'logout')
          ),
          switchMap(event => {
            // a logout cancels a pending retry, which would refresh the removed or replacing tokens
            if (event.type === 'logout') {
              return EMPTY;
            }
            // the access token of the refresh, a rejected refresh must not end the session of a replacing token
            let refreshedAccessToken: string;
            return defer(() => {
              refreshedAccessToken = this.oAuthService.getAccessToken();
              return from(this.oAuthService.refreshToken());
            }).pipe(
              // the refresh starts before the access token expires, so temporary errors can be retried
              retry({
                count: REFRESH_RETRY_COUNT,
                delay: error => (isTemporaryError(error) ? timer(REFRESH_RETRY_DELAY) : throwError(() => error)),
              }),
              catchError(error => {
                if (HttpErrorHelper.isRejectedTokenRefresh(httpErrorStatus(error))) {
                  console.warn('Error refreshing token, clearing session:', error);
                  this.apiTokenService.invalidateApiToken(refreshedAccessToken);
                } else {
                  // the session ends once the ICM rejects the expired access token
                  console.warn('Error refreshing token, keeping session:', error);
                }
                return EMPTY;
              })
            );
          })
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
