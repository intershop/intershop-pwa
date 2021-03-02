import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { of, race, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, switchMap, take, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

@Injectable()
export class PunchoutPageGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountFacade: AccountFacade,
    private appFacade: AppFacade,
    private cookiesService: CookiesService,
    private punchoutService: PunchoutService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    // check for a HOOK_URL before doing anything with the punchout route
    if (!route.queryParamMap.has('HOOK_URL')) {
      this.appFacade.setBusinessError('punchout.error.missing.hook_url');
      return false;
    }

    // prevent any punchout handling on the server and instead show loading
    if (isPlatformServer(this.platformId)) {
      return this.router.parseUrl('/loading');
    }

    // initiate the punchout user login with the given credentials
    this.accountFacade.loginUser({
      login: route.queryParamMap.get('USERNAME'),
      password: route.queryParamMap.get('PASSWORD'),
    });

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
          // save HOOK_URL to 'hookURL' cookie
          if (route.queryParamMap.get('HOOK_URL')) {
            this.cookiesService.put('hookURL', route.queryParamMap.get('HOOK_URL'), { sameSite: 'Strict' });
          }

          // Product Details
          if (route.queryParamMap.get('FUNCTION') === 'DETAIL' && route.queryParamMap.get('PRODUCTID')) {
            return of(this.router.parseUrl(`/product/${route.queryParamMap.get('PRODUCTID')}`));

            // Validation of Products
          } else if (route.queryParamMap.get('FUNCTION') === 'VALIDATE' && route.queryParamMap.get('PRODUCTID')) {
            return this.punchoutService
              .getProductPunchoutData(route.queryParamMap.get('PRODUCTID'), route.queryParamMap.get('QUANTITY'))
              .pipe(
                tap(data => this.punchoutService.submitPunchoutData(data)),
                mapTo(false)
              );

            // Background Search
          } else if (
            route.queryParamMap.get('FUNCTION') === 'BACKGROUND_SEARCH' &&
            route.queryParamMap.get('SEARCHSTRING')
          ) {
            return this.punchoutService.getSearchPunchoutData(route.queryParamMap.get('SEARCHSTRING')).pipe(
              tap(data => this.punchoutService.submitPunchoutData(data, false)),
              mapTo(false)
            );

            // Login
          } else {
            return of(this.router.parseUrl('/home'));
          }
        })
      )
    ).pipe(
      catchError(error =>
        of(this.router.parseUrl('/error')).pipe(
          tap(() => {
            this.appFacade.setBusinessError(error);
          })
        )
      )
    );
  }
}
