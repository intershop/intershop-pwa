/* eslint-disable etc/no-deprecated */
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, noop, of, race, throwError } from 'rxjs';
import { catchError, concatMap, delay, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { IdentityProvider, TriggerReturnType } from 'ish-core/identity-provider/identity-provider.interface';
import { TokenService } from 'ish-core/services/token/token.service';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { PunchoutService } from '../services/punchout/punchout.service';

@Injectable({ providedIn: 'root' })
export class PunchoutIdentityProvider implements IdentityProvider {
  constructor(
    protected router: Router,
    protected store: Store,
    protected apiTokenService: ApiTokenService,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade,
    private punchoutService: PunchoutService,
    private cookiesService: CookiesService,
    private checkoutFacade: CheckoutFacade,
    private tokenService: TokenService
  ) {}

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

    // OAuth Service should be configured before apiToken information are restored and the refresh token mechanism is setup
    this.apiTokenService.restore$(['user', 'order']).subscribe(noop);

    this.checkoutFacade.basket$.pipe(whenTruthy(), first()).subscribe(basketView => {
      window.sessionStorage.setItem('basket-id', basketView.id);
    });
  }

  triggerLogin(route: ActivatedRouteSnapshot): TriggerReturnType {
    // check for required start parameters before doing anything with the punchout route
    // 'sid', 'access-token' (cXML) or 'HOOK_URL', 'USERNAME', 'PASSWORD' (OCI)
    if (
      !(
        (route.queryParamMap.has('sid') && route.queryParamMap.has('access-token')) ||
        (route.queryParamMap.has('HOOK_URL') &&
          route.queryParamMap.has('USERNAME') &&
          route.queryParamMap.has('PASSWORD'))
      )
    ) {
      this.appFacade.setBusinessError('punchout.error.missing.parameters');
      return false;
    }

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
    window.sessionStorage.removeItem('basket-id');
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
      // persist cXML session information (sid, returnURL, basketId) in cookies for later basket transfer
      tap(data => {
        this.cookiesService.put('punchout_SID', route.queryParamMap.get('sid'));
        this.cookiesService.put('punchout_ReturnURL', data.returnURL);
        this.cookiesService.put('punchout_BasketID', data.basketId);
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
    // save HOOK_URL to cookie for later basket transfer
    this.cookiesService.put('punchout_HookURL', route.queryParamMap.get('HOOK_URL'));

    const basketId = window.sessionStorage.getItem('basket-id');
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
