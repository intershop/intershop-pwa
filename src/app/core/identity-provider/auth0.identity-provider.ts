import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { UUID } from 'angular2-uuid';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, concatMap, first, map, switchMap, switchMapTo, take, tap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getUserAuthorized, loadUserByAPIToken } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { IdentityProvider } from './identity-provider.interface';

export interface Auth0Config {
  type: 'auth0';
  domain: string;
  clientID: string;
}

@Injectable({ providedIn: 'root' })
export class Auth0IdentityProvider implements IdentityProvider {
  constructor(
    private oauthService: OAuthService,
    private apiService: ApiService,
    private store: Store,
    private router: Router,
    private apiTokenService: ApiTokenService
  ) {}

  getCapabilities() {
    return {
      editPassword: false,
      editEmail: false,
      editProfile: false,
    };
  }

  init(config: Auth0Config) {
    this.oauthService.configure({
      // Your Auth0 app's domain
      // Important: Don't forget to start with https:// AND the trailing slash!
      issuer: `https://${config.domain}/`,

      // The app's clientId configured in Auth0
      clientId: config.clientID,

      // The app's redirectUri configured in Auth0
      redirectUri: window.location.origin + '/loading',

      // logout redirect URL
      postLogoutRedirectUri: window.location.origin,

      // Scopes ("rights") the Angular application wants get delegated
      // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
      scope: 'openid email profile',

      // Using Authorization Code Flow
      // (PKCE is activated by default for authorization code flow)
      responseType: 'code',

      // Your Auth0 account's logout url
      // Derive it from your application's domain
      logoutUrl: `https://${config.domain}/v2/logout`,
    });

    this.apiTokenService
      .restore$(['basket', 'order'])
      .pipe(
        tap(() => {
          this.oauthService.setupAutomaticSilentRefresh();
          this.oauthService.loadDiscoveryDocumentAndTryLogin();
        }),
        switchMapTo(
          timer(0, 200).pipe(
            map(() => this.oauthService.getIdToken()),
            take(100),
            whenTruthy(),
            take(1)
          )
        ),
        whenTruthy(),
        switchMap(idToken =>
          this.apiService
            .post('users/processtoken', {
              id_token: idToken,
              options: ['UPDATE'],
            })
            .pipe(
              catchError((httpError: HttpError) =>
                httpError?.status >= 400 && httpError?.status < 500
                  ? // user does not exist -> create
                    this.apiService
                      .post<{ id: string }>('users/processtoken', {
                        id_token: idToken,
                        options: ['CREATE_USER'],
                      })
                      .pipe(
                        concatMap(({ id: userId }) =>
                          this.apiService.post('/privatecustomers', { userId, customerNo: UUID.UUID() })
                        )
                      )
                  : throwError(httpError)
              ),
              tap(() => {
                this.store.dispatch(loadUserByAPIToken());
              }),
              switchMapTo(this.store.pipe(select(getUserAuthorized), whenTruthy(), first()))
            )
        )
      )
      .subscribe(() => {
        this.apiTokenService.removeApiToken();
        if (this.router.url.startsWith('/loading')) {
          this.router.navigateByUrl('/account');
        }
      });
  }

  triggerLogin() {
    this.router.navigateByUrl('/loading');
    return this.oauthService.loadDiscoveryDocumentAndLogin();
  }

  triggerLogout() {
    this.oauthService.revokeTokenAndLogout(
      {
        client_id: this.oauthService.clientId,
        returnTo: this.oauthService.postLogoutRedirectUri,
      },
      true
    );
    return this.router.parseUrl('/loading');
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.oauthService.getIdToken()) {
      // fallback to standard handling
      return this.apiTokenService.intercept(req, next);
    }

    const newRequest =
      this.oauthService.getIdToken() &&
      !req.url.endsWith('users/processtoken') &&
      !req.headers.has(ApiService.TOKEN_HEADER_KEY)
        ? req.clone({
            headers: req.headers.set(ApiService.AUTHORIZATION_HEADER_KEY, 'Bearer ' + this.oauthService.getIdToken()),
          })
        : req;
    return next.handle(newRequest);
  }
}
