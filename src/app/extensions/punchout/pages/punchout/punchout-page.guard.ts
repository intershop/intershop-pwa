import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { of } from 'rxjs';
import { delay, first, switchMap, switchMapTo, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable: no-console
@Injectable()
export class PunchoutPageGuard implements CanActivate {
  constructor(private router: Router, private accountFacade: AccountFacade, private cookiesService: CookiesService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    console.log('punchout parameters:', route.queryParams);

    // TODO: should there be a general check for a HOOK_URL before doing anything with the punchout route?

    // TODO: visual feedback like loading?

    return of(undefined) // brauche was zum stream starten, geht bestimmt auch besser?
      .pipe(
        tap(() => {
          this.accountFacade.loginUser({
            login: route.queryParams.USERNAME,
            password: route.queryParams.PASSWORD,
          });
        }),
        switchMapTo(this.accountFacade.isLoggedIn$),
        whenTruthy(), // TODO: hier müsste dann ein branching rein, wenn es nicht klappt?
        first(),
        delay(0), // this delay is needed to prevent any unwanted automatic effects e.g. routing
        switchMap(() => {
          // save HOOK_URL to 'hookURL' cookie
          if (route.queryParams.HOOK_URL) {
            this.cookiesService.put('hookURL', route.queryParams.HOOK_URL);
          }

          // Product Details
          if (route.queryParams.FUNCTION === 'DETAIL' && route.queryParams.PRODUCTID) {
            console.log('DETAIL', route.queryParams.PRODUCTID);
            return of(this.router.parseUrl(`/product/${route.queryParams.PRODUCTID}`));

            // Validation of Products
          } else if (route.queryParams.FUNCTION === 'VALIDATE' && route.queryParams.PRODUCTID) {
            console.log('VALIDATE', route.queryParams.PRODUCTID);

            // Background Search
          } else if (route.queryParams.FUNCTION === 'BACKGROUND_SEARCH' && route.queryParams.SEARCHSTRING) {
            console.log('BACKGROUND_SEARCH', route.queryParams.SEARCHSTRING);

            // Login URL
          } else {
            console.log('LOGIN', route.queryParams.PRODUCTID);
            return of(this.router.parseUrl('/home'));
          }
          console.log('END');
          return of(false);
        })
      );
  }
}
