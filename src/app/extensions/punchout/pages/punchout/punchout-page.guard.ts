import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { of } from 'rxjs';
import { concatMap, delay, first, switchMap, switchMapTo, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { log } from 'ish-core/utils/dev/operators';
import { whenTruthy } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

// tslint:disable: no-console
@Injectable()
export class PunchoutPageGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountFacade: AccountFacade,
    private cookiesService: CookiesService,
    private punchoutService: PunchoutService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    console.log('punchout parameters:', route.queryParams);

    // TODO: should there be a general check for a HOOK_URL before doing anything with the punchout route?

    // TODO: visual feedback like loading?

    // TODO: a better idea to start the stream?
    return of(undefined).pipe(
      tap(() => {
        this.accountFacade.loginUser({
          login: route.queryParams.USERNAME,
          password: route.queryParams.PASSWORD,
        });
      }),
      switchMapTo(this.accountFacade.isLoggedIn$),
      whenTruthy(), // TODO: do we need a branching if there are problems?
      first(),
      delay(0), // this delay is needed to prevent any unwanted automatic effects e.g. additional routing
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
          this.punchoutService
            .getProductPunchoutData(route.queryParams.PRODUCTID)
            .pipe(
              log('validation data'),
              concatMap(data => this.punchoutService.submitPunchoutData(data))
            )
            .subscribe();

          // Background Search
        } else if (route.queryParams.FUNCTION === 'BACKGROUND_SEARCH' && route.queryParams.SEARCHSTRING) {
          console.log('BACKGROUND_SEARCH', route.queryParams.SEARCHSTRING);
          this.punchoutService
            .getSearchPunchoutData(route.queryParams.SEARCHSTRING)
            .pipe(
              log('search data'),
              concatMap(data => this.punchoutService.submitPunchoutData(data, false))
            )
            .subscribe();

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
