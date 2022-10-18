import { APP_BASE_HREF } from '@angular/common';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, combineLatest, from, of, race, timer } from 'rxjs';
import { catchError, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { UserData } from 'ish-core/models/user/user.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { getSsoRegistrationCancelled, getSsoRegistrationRegistered } from 'ish-core/store/customer/sso-registration';
import {
  getLoggedInCustomer,
  getUserAuthorized,
  getUserLoading,
  loadUserByAPIToken,
} from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { OAuthConfigurationService } from 'ish-core/utils/oauth-configuration/oauth-configuration.service';
import { delayUntil, whenTruthy } from 'ish-core/utils/operators';

import { IdentityProvider, IdentityProviderCapabilities, TriggerReturnType } from './identity-provider.interface';

export interface Auth0Config {
  type: 'auth0';
  domain: string;
  clientID: string;
}

@Injectable({ providedIn: 'root' })
export class Auth0IdentityProvider implements IdentityProvider {
  // emits true, when OAuth Service is successfully configured
  // used as an additional condition to check that the OAuth Service is configured before OAuth Service actions are used
  private oAuthServiceConfigured$ = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService,
    private store: Store,
    private router: Router,
    private apiTokenService: ApiTokenService,
    private oauthService: OAuthService,
    private configService: OAuthConfigurationService,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

  getCapabilities(): IdentityProviderCapabilities {
    return {
      editPassword: false,
      editEmail: false,
      editProfile: false,
    };
  }

  init(config: Auth0Config) {
    const effectiveOrigin = this.baseHref === '/' ? window.location.origin : window.location.origin + this.baseHref;

    // use internal OAuth configuration service for tokenEndpoint configuration
    this.configService.config$.pipe(whenTruthy(), take(1)).subscribe(serviceConf => {
      this.oauthService.configure({
        // Your Auth0 app's domain
        // Important: Don't forget to start with https:// AND the trailing slash!
        issuer: `https://${config.domain}/`,

        // The app's clientId configured in Auth0
        clientId: config.clientID,

        // The app's redirectUri configured in Auth0
        redirectUri: `${effectiveOrigin}/loading`,

        // logout redirect URL
        postLogoutRedirectUri: effectiveOrigin,

        // Scopes ("rights") the Angular application wants get delegated
        // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
        scope: 'openid email profile offline_access',

        // Using Authorization Code Flow
        // (PKCE is activated by default for authorization code flow)
        responseType: 'code',

        // Your Auth0 account's logout url
        // Derive it from your application's domain
        logoutUrl: `https://${config.domain}/v2/logout`,

        sessionChecksEnabled: true,

        // ICM token endpoint to retrieve a valid token for an anonymous user
        tokenEndpoint: serviceConf?.tokenEndpoint,

        requireHttps: serviceConf?.requireHttps,
      });
      this.oauthService.setupAutomaticSilentRefresh();
      this.oAuthServiceConfigured$.next(true);
    });

    // OAuth Service should be configured before apiToken informations are restored
    this.oAuthServiceConfigured$
      .pipe(
        whenTruthy(),
        take(1),
        switchMap(() =>
          // anonymous user token should only be fetched when no user is logged in
          this.apiTokenService.restore$(['user', 'order'], !this.oauthService.getIdToken()).pipe(
            delayUntil(this.oAuthServiceConfigured$),
            switchMap(() => from(this.oauthService.loadDiscoveryDocumentAndTryLogin())),
            switchMap(() =>
              timer(0, 200).pipe(
                map(() => this.oauthService.getIdToken()),
                take(100),
                whenTruthy(),
                take(1)
              )
            ),
            whenTruthy(),
            switchMap(idToken => {
              const inviteUserId = window.sessionStorage.getItem('invite-userid');
              const inviteHash = window.sessionStorage.getItem('invite-hash');
              return inviteUserId && inviteHash
                ? this.inviteRegistration(idToken, inviteUserId, inviteHash).pipe(
                    tap(() => {
                      window.sessionStorage.removeItem('invite-userid');
                      window.sessionStorage.removeItem('invite-hash');
                    })
                  )
                : this.normalSignInRegistration(idToken);
            })
          )
        )
      )
      .subscribe(() => {
        this.apiTokenService.removeApiToken();
        if (this.router.url.startsWith('/loading') || this.router.url.startsWith('/register')) {
          this.router.navigateByUrl(this.oauthService.state ? decodeURIComponent(this.oauthService.state) : '/account');
        }
      });
  }

  private normalSignInRegistration(idToken: string) {
    return this.apiService
      .post<UserData>('users/processtoken', {
        id_token: idToken,
        options: ['CREATE_USER'],
      })
      .pipe(
        tap(() => {
          this.store.dispatch(loadUserByAPIToken());
        }),
        switchMap((userData: UserData) =>
          combineLatest([this.store.pipe(select(getLoggedInCustomer)), this.store.pipe(select(getUserLoading))]).pipe(
            filter(([, loading]) => !loading),
            first(),
            switchMap(([customer]) =>
              !customer
                ? this.router.navigate(['/register', 'sso'], {
                    queryParams: {
                      userid: userData.businessPartnerNo,
                      firstName: userData.firstName,
                      lastName: userData.lastName,
                    },
                  })
                : of(false)
            ),
            switchMap((navigated: boolean) =>
              // eslint-disable-next-line unicorn/no-null
              navigated || navigated === null
                ? race(
                    this.store.pipe(
                      select(getSsoRegistrationRegistered),
                      whenTruthy(),
                      tap(() => {
                        this.store.dispatch(loadUserByAPIToken());
                      })
                    ),
                    this.store.pipe(
                      select(getSsoRegistrationCancelled),
                      whenTruthy(),
                      map(() => false),
                      tap(() => this.router.navigateByUrl('/logout'))
                    )
                  )
                : of(navigated)
            )
          )
        ),
        switchMap(() => this.store.pipe(select(getUserAuthorized), whenTruthy(), first())),
        catchError((error: HttpError) => {
          this.apiTokenService.removeApiToken();
          this.triggerLogout();
          return of(error);
        })
      );
  }

  private inviteRegistration(idToken: string, userId: string, hash: string) {
    return this.apiService
      .post<UserData>('users/processtoken', {
        id_token: idToken,
        secure_user_ref: {
          user_id: userId,
          secure_code: hash,
        },
        options: ['UPDATE'],
      })
      .pipe(
        tap(() => {
          this.store.dispatch(loadUserByAPIToken());
        }),
        switchMap(() => this.store.pipe(select(getUserAuthorized), whenTruthy(), first())),
        catchError((error: HttpError) => {
          this.apiTokenService.removeApiToken();
          this.triggerLogout();
          return of(error);
        })
      );
  }

  triggerRegister(route: ActivatedRouteSnapshot): TriggerReturnType {
    if (route.queryParamMap.get('userid')) {
      return of(true);
    } else {
      return this.oAuthServiceConfigured$.pipe(
        whenTruthy(),
        take(1),
        tap(() => {
          this.router.navigateByUrl('/loading');
          this.oauthService.loadDiscoveryDocumentAndLogin({
            state: route.queryParams.returnUrl,
          });
        })
      );
    }
  }

  triggerLogin(route: ActivatedRouteSnapshot): TriggerReturnType {
    return this.oAuthServiceConfigured$.pipe(
      whenTruthy(),
      take(1),
      tap(() => {
        this.router.navigateByUrl('/loading');
        this.oauthService.loadDiscoveryDocumentAndLogin({
          state: route.queryParams.returnUrl,
        });
      })
    );
  }

  triggerInvite(route: ActivatedRouteSnapshot): TriggerReturnType {
    return this.oAuthServiceConfigured$.pipe(
      whenTruthy(),
      take(1),
      tap(() => {
        this.router.navigateByUrl('/loading');
        window.sessionStorage.setItem('invite-userid', route.queryParams.uid);
        window.sessionStorage.setItem('invite-hash', route.queryParams.Hash);
        this.oauthService.loadDiscoveryDocumentAndLogin({
          state: route.queryParams.returnUrl,
        });
      })
    );
  }

  triggerLogout(): TriggerReturnType {
    if (this.oauthService.hasValidIdToken()) {
      if (this.oauthService.discoveryDocumentLoaded) {
        this.oauthService.revokeTokenAndLogout(
          {
            client_id: this.oauthService.clientId,
            returnTo: this.oauthService.postLogoutRedirectUri,
          },
          true
        );
        return this.router.parseUrl('/loading');
      }
      this.oauthService.logOut(true);
      return false;
    }
    return false;
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
            headers: req.headers.set(ApiService.AUTHORIZATION_HEADER_KEY, `Bearer ${this.oauthService.getIdToken()}`),
          })
        : req;
    return next.handle(newRequest);
  }
}
