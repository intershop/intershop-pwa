import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { of, race, throwError } from 'rxjs';
import { catchError, concatMap, delay, first, mapTo, switchMap, take, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

@Injectable()
export class PunchoutPageGuard implements CanActivate {
  constructor(
    private router: Router,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private apiTokenService: ApiTokenService,
    private cookiesService: CookiesService,
    private punchoutService: PunchoutService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
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

    // prevent any punchout handling on the server and instead show loading
    if (isPlatformServer(this.platformId)) {
      return this.router.parseUrl('/loading');
    }

    // initiate the punchout user login with the access-token (cXML) or the given credentials (OCI)
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
        // tslint:disable-next-line: no-unnecessary-callback-wrapper
        concatMap(userError => throwError(userError))
      ),

      // handle the punchout functions once the punchout user is logged in
      this.accountFacade.isLoggedIn$.pipe(
        whenTruthy(),
        take(1),
        switchMap(() => {
          // handle cXML punchout with sid
          if (route.queryParamMap.get('sid')) {
            // fetch sid session information (basketId, returnURL, operation, ...)
            return this.punchoutService.getCxmlPunchoutSession(route.queryParamMap.get('sid')).pipe(
              // persist cXML session information (sid, returnURL, basketId) in cookies for later basket transfer
              tap(data => {
                this.cookiesService.put('punchout_SID', route.queryParamMap.get('sid'), { sameSite: 'Strict' });
                this.cookiesService.put('punchout_ReturnURL', data.returnURL, { sameSite: 'Strict' });
                this.cookiesService.put('punchout_BasketID', data.basketId, { sameSite: 'Strict' });
              }),
              // use the basketId basket for the current PWA session (instead of default current basket)
              // TODO: if load basket error (currently no error page) -> logout and do not use default 'current' basket
              // TODO: if loadBasketWithId is faster then the initial loading of the 'current' basket after login the wrong 'current' basket might be used (the additional delay is the current work around)
              delay(500),
              tap(data => this.checkoutFacade.loadBasketWithId(data.basketId)),
              mapTo(this.router.parseUrl('/home'))
            );

            // handle OCI punchout with HOOK_URL
          } else if (route.queryParamMap.get('HOOK_URL')) {
            // save HOOK_URL to cookie for later basket transfer
            this.cookiesService.put('punchout_HookURL', route.queryParamMap.get('HOOK_URL'), { sameSite: 'Strict' });

            // create a new basket for every punchout session to avoid basket conflicts for concurrent punchout sessions
            this.checkoutFacade.createBasket();

            // Product Details
            if (route.queryParamMap.get('FUNCTION') === 'DETAIL' && route.queryParamMap.get('PRODUCTID')) {
              return of(this.router.parseUrl(`/product/${route.queryParamMap.get('PRODUCTID')}`));

              // Validation of Products
            } else if (route.queryParamMap.get('FUNCTION') === 'VALIDATE' && route.queryParamMap.get('PRODUCTID')) {
              return this.punchoutService
                .getOciPunchoutProductData(
                  route.queryParamMap.get('PRODUCTID'),
                  route.queryParamMap.get('QUANTITY') || '1'
                )
                .pipe(
                  tap(data => this.punchoutService.submitOciPunchoutData(data)),
                  mapTo(false)
                );

              // Background Search
            } else if (
              route.queryParamMap.get('FUNCTION') === 'BACKGROUND_SEARCH' &&
              route.queryParamMap.get('SEARCHSTRING')
            ) {
              return this.punchoutService.getOciPunchoutSearchData(route.queryParamMap.get('SEARCHSTRING')).pipe(
                tap(data => this.punchoutService.submitOciPunchoutData(data, false)),
                mapTo(false)
              );

              // Login
            } else {
              return of(this.router.parseUrl('/home'));
            }
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
}
