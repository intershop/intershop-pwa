import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, merge, noop } from 'rxjs';
import { filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { OAuthConfigurationService } from 'ish-core/utils/oauth-configuration/oauth-configuration.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { IdentityProvider, TriggerReturnType } from './identity-provider.interface';

@Injectable({ providedIn: 'root' })
export class ICMIdentityProvider implements IdentityProvider {
  // emits true, when OAuth Service is successfully configured
  // used as an additional condition to check that the OAuth Service is configured before OAuth Service actions are used
  private oAuthServiceConfigured$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private store: Store,
    private apiTokenService: ApiTokenService,
    private accountFacade: AccountFacade,
    private oAuthService: OAuthService,
    private configService: OAuthConfigurationService
  ) {}

  getCapabilities() {
    return {
      editPassword: true,
      editEmail: true,
      editProfile: true,
    };
  }

  init() {
    // OAuth Service should be configured by internal OAuth configuration service
    this.configService.config$.pipe(whenTruthy(), take(1)).subscribe(config => {
      this.oAuthService.configure(config);
      this.oAuthServiceConfigured$.next(true);
    });

    this.apiTokenService.cookieVanishes$
      .pipe(withLatestFrom(this.apiTokenService.apiToken$))
      .subscribe(([type, apiToken]) => {
        this.accountFacade.logoutUser({ revokeApiToken: false });
        if (!apiToken) {
          this.accountFacade.fetchAnonymousToken();
        }
        if (type === 'user') {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url, messageKey: 'session_timeout' },
          });
        }
      });

    // OAuth Service should be configured before apiToken informations are restored and the refresh token mechanism is setup
    this.oAuthServiceConfigured$
      .pipe(
        whenTruthy(),
        take(1),
        switchMap(() => merge(this.apiTokenService.restore$(), this.configService.setupRefreshTokenMechanism$()))
      )
      .subscribe(noop);
  }

  triggerLogin(): TriggerReturnType {
    return true;
  }

  triggerLogout(): TriggerReturnType {
    return this.oAuthServiceConfigured$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.accountFacade.logoutUser()), // user will be logged out and related refresh token is revoked on server
      switchMap(() =>
        this.accountFacade.isLoggedIn$.pipe(
          // wait until the user is logged out before you go to homepage to prevent unnecessary REST calls
          filter(loggedIn => !loggedIn),
          take(1),
          switchMap(() =>
            this.store.pipe(
              select(selectQueryParam('returnUrl')),
              map(returnUrl => returnUrl || '/home'),
              map(returnUrl => this.router.parseUrl(returnUrl))
            )
          )
        )
      )
    );
  }

  triggerRegister(): TriggerReturnType {
    return true;
  }

  triggerInvite(route: ActivatedRouteSnapshot): TriggerReturnType {
    return this.router.createUrlTree(['forgotPassword', 'updatePassword'], {
      queryParams: { uid: route.queryParams.uid, Hash: route.queryParams.Hash },
    });
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.apiTokenService.intercept(req, next);
  }
}
