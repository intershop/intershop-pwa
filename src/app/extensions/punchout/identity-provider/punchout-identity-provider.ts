/* eslint-disable @typescript-eslint/no-deprecated */
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of, race, throwError } from 'rxjs';
import { catchError, concatMap, delay, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { IdentityProvider, TriggerReturnType } from 'ish-core/identity-provider/identity-provider.interface';
import { TokenService } from 'ish-core/services/token/token.service';
import { getIdentityProvider } from 'ish-core/store/core/configuration';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { PunchoutService } from '../services/punchout/punchout.service';

interface PunchoutIdentityProviderConfig {
  type: string;
  /**
   * Schemes an OCI punchout HOOK_URL may use (array or comma-separated string), default: 'http', 'https', and 'sapevent'.
   * Script schemes ('javascript', 'data', 'vbscript') are never allowed.
   */
  hookUrlSchemes?: string | string[];
}

const DEFAULT_HOOK_URL_SCHEMES = ['http', 'https', 'sapevent'];

const FORBIDDEN_HOOK_URL_SCHEMES = ['javascript', 'data', 'vbscript'];

// the scheme has to start at the first character, browsers ignore leading whitespace and control characters
const HOOK_URL_SCHEME_PATTERN = /^([a-z][\d+.a-z-]*):/i;

@Injectable({ providedIn: 'root' })
export class PunchoutIdentityProvider implements IdentityProvider<PunchoutIdentityProviderConfig> {
  constructor(
    protected router: Router,
    protected store: Store,
    protected apiTokenService: ApiTokenService,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade,
    private punchoutService: PunchoutService,
    private checkoutFacade: CheckoutFacade,
    private tokenService: TokenService
  ) {}

  /**
   * Checks that the HOOK_URL starts with an allowed scheme, the same way as the ICM validates the OCI return URL.
   * If no usable schemes are configured, the default schemes are allowed.
   */
  private static isValidHookUrl(hookUrl: string, hookUrlSchemes: string | string[]): boolean {
    const configuredSchemes = (typeof hookUrlSchemes === 'string' ? hookUrlSchemes.split(',') : (hookUrlSchemes ?? []))
      .map(scheme => scheme?.trim().toLowerCase())
      .filter(scheme => !!scheme && !FORBIDDEN_HOOK_URL_SCHEMES.includes(scheme));
    const allowedSchemes = configuredSchemes.length ? configuredSchemes : DEFAULT_HOOK_URL_SCHEMES;

    const scheme = HOOK_URL_SCHEME_PATTERN.exec(hookUrl)?.[1]?.toLowerCase();
    return !!scheme && allowedSchemes.includes(scheme);
  }

  getCapabilities() {
    return {
      editPassword: true,
      editEmail: true,
      editProfile: true,
    };
  }

  init() {
    this.apiTokenService.getCookieVanishes$().subscribe(type => {
      if (type === 'user') {
        this.accountFacade.logoutUser({ revokeApiToken: false });
      }
    });

    this.checkoutFacade.basket$.pipe(whenTruthy(), first()).subscribe(basketView => {
      sessionStorage.setItem('basket-id', basketView.id);
    });
  }

  triggerLogin(route: ActivatedRouteSnapshot): TriggerReturnType {
    // check for required start parameters before doing anything with the punchout route
    // 'sid', 'access-token' (cXML) or 'HOOK_URL', 'USERNAME', 'PASSWORD' (OCI)
    if (!(
      (route.queryParamMap.has('sid') && route.queryParamMap.has('access-token')) ||
      (route.queryParamMap.has('HOOK_URL') &&
        route.queryParamMap.has('USERNAME') &&
        route.queryParamMap.has('PASSWORD'))
    )) {
      this.appFacade.setBusinessError('punchout.error.missing.parameters');
      return false;
    }

    // the configuration is read from the store, because init() is called delayed and might not have run yet
    return this.store.pipe(
      select(getIdentityProvider),
      take(1),
      switchMap(config => {
        // reject an OCI HOOK_URL with a script or other not allowed scheme before logging in
        if (
          route.queryParamMap.has('HOOK_URL') &&
          !PunchoutIdentityProvider.isValidHookUrl(
            route.queryParamMap.get('HOOK_URL'),
            (config as PunchoutIdentityProviderConfig)?.hookUrlSchemes
          )
        ) {
          this.appFacade.setBusinessError('punchout.error.invalid.hook_url');
          return of(this.router.parseUrl('/error'));
        }
        return this.loginPunchoutUser(route);
      })
    );
  }

  private loginPunchoutUser(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    // the punchout user is logged in with the given login parameters only, the session of a previous login must not be used
    this.apiTokenService.discardApiToken();
    this.tokenService.logOut();

    if (route.queryParamMap.has('access-token')) {
      this.accountFacade.loginUserWithToken(route.queryParamMap.get('access-token'));
    } else {
      this.accountFacade.loginUser({
        login: route.queryParamMap.get('USERNAME'),
        password: route.queryParamMap.get('PASSWORD'),
      });
    }

    return race(
      // throw an error if a user login error occurs
      this.accountFacade.userError$.pipe(
        whenTruthy(),
        take(1),
        concatMap(userError => throwError(() => userError))
      ),

      // handle the punchout functions once the punchout user is logged in
      this.accountFacade.isLoggedIn$.pipe(
        whenTruthy(),
        take(1),
        switchMap(() => {
          // handle cXML punchout with sid
          if (route.queryParamMap.get('sid')) {
            return this.handleCxmlPunchoutLogin(route);
            // handle OCI punchout with HOOK_URL
          } else if (route.queryParamMap.get('HOOK_URL')) {
            return this.handleOciPunchoutLogin(route);
          }
        }),
        // punchout error after successful authentication (needs to logout)
        catchError(error =>
          this.accountFacade.userLoading$.pipe(
            first(loading => !loading),
            delay(0),
            switchMap(() => {
              this.accountFacade.logoutUser();
              this.apiTokenService.removeApiToken();
              this.appFacade.setBusinessError(error);
              return of(this.router.parseUrl('/error'));
            })
          )
        )
      )
    ).pipe(
      // general punchout error handling (parameter missing, authentication error)
      catchError(error => {
        this.appFacade.setBusinessError(error);
        return of(this.router.parseUrl('/error'));
      })
    );
  }

  triggerLogout(): TriggerReturnType {
    sessionStorage.removeItem('basket-id');
    this.accountFacade.logoutUser(); // user will be logged out and related refresh token is revoked on server
    return this.accountFacade.isLoggedIn$.pipe(
      // wait until the user is logged out before you go to homepage to prevent unnecessary REST calls
      filter(loggedIn => !loggedIn),
      take(1),
      tap(() => this.tokenService.logOut()), // remove token from storage when user is logged out
      switchMap(() =>
        this.store.pipe(
          select(selectQueryParam('returnUrl')),
          map(returnUrl => returnUrl || '/home'),
          map(returnUrl => this.router.parseUrl(returnUrl))
        )
      )
    );
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.apiTokenService.intercept(req, next);
  }

  private handleCxmlPunchoutLogin(route: ActivatedRouteSnapshot): Observable<UrlTree> {
    // fetch sid session information (basketId, returnURL, operation, ...)
    return this.punchoutService.getCxmlPunchoutSession(route.queryParamMap.get('sid')).pipe(
      // persist cXML session information (sid, returnURL, basketId) in session storage for later basket transfer
      tap(data => {
        sessionStorage.setItem('punchout_SID', route.queryParamMap.get('sid'));
        sessionStorage.setItem('punchout_ReturnURL', data.returnURL);
        sessionStorage.setItem('punchout_BasketID', data.basketId);
      }),
      // use the basketId basket for the current PWA session (instead of default current basket)
      // TODO: if load basket error (currently no error page) -> logout and do not use default 'current' basket
      // TODO: if loadBasketWithId is faster then the initial loading of the 'current' basket after login the wrong 'current' basket might be used (the additional delay is the current work around)
      delay(500),
      tap(data => this.checkoutFacade.loadBasketWithId(data.basketId)),
      map(() => this.router.parseUrl('/home'))
    );
  }

  private handleOciPunchoutLogin(route: ActivatedRouteSnapshot) {
    // save HOOK_URL to session storage for later basket transfer
    sessionStorage.setItem('punchout_HookURL', route.queryParamMap.get('HOOK_URL'));

    const basketId = sessionStorage.getItem('basket-id');
    if (!basketId) {
      // create a new basket for every punchout session to avoid basket conflicts for concurrent punchout sessions
      this.checkoutFacade.createBasket();
    } else {
      this.checkoutFacade.loadBasketWithId(basketId);
    }

    // Product Details
    if (route.queryParamMap.get('FUNCTION') === 'DETAIL' && route.queryParamMap.get('PRODUCTID')) {
      return of(this.router.parseUrl(`/product/${route.queryParamMap.get('PRODUCTID')}`));

      // Validation of Products - @deprecated This functionality should be handled by the ICM pipeline `ViewOCICatalogPWA-Start`.
    } else if (route.queryParamMap.get('FUNCTION') === 'VALIDATE' && route.queryParamMap.get('PRODUCTID')) {
      return this.punchoutService
        .getOciPunchoutProductData(route.queryParamMap.get('PRODUCTID'), route.queryParamMap.get('QUANTITY') || '1')
        .pipe(
          tap(data => this.punchoutService.submitOciPunchoutData(data)),
          map(() => false)
        );

      // Background Search - @deprecated: is now handled by the ICM ViewOCICatalogPWA-Start pipeline
    } else if (route.queryParamMap.get('FUNCTION') === 'BACKGROUND_SEARCH' && route.queryParamMap.get('SEARCHSTRING')) {
      return this.punchoutService.getOciPunchoutSearchData(route.queryParamMap.get('SEARCHSTRING')).pipe(
        tap(data => this.punchoutService.submitOciPunchoutData(data, false)),
        map(() => false)
      );

      // Login
    } else {
      return of(this.router.parseUrl('/home'));
    }
  }
}
