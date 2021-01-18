import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class PunchoutPageGuard implements CanActivate {
  constructor(private router: Router, private accountFacade: AccountFacade, private cookiesService: CookiesService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    // tslint:disable-next-line: no-console
    console.log('punchout parameters:', route.queryParams);

    // TODO: should there be a general check for a HOOK_URL before doing anything with the punchout route?

    this.router.navigateByUrl('/loading', { replaceUrl: false, skipLocationChange: true });

    // TODO: unsubscribe
    this.accountFacade.isLoggedIn$.pipe(whenTruthy()).subscribe(() => {
      // save HOOK_URL to 'hookURL' cookie
      if (route.queryParams.HOOK_URL) {
        this.cookiesService.put('hookURL', route.queryParams.HOOK_URL);
      }

      if (route.queryParams.FUNCTION === 'DETAIL' && route.queryParams.PRODUCTID) {
        this.router.navigateByUrl(`/product/${route.queryParams.PRODUCTID}`, {
          replaceUrl: false,
          skipLocationChange: true,
        });
      } else {
        this.router.navigateByUrl('/home', { replaceUrl: false, skipLocationChange: true });
        // return this.router.parseUrl('/home');
      }
    });

    this.accountFacade.loginUser({
      login: route.queryParams.USERNAME,
      password: route.queryParams.PASSWORD,
    });

    return false;
  }
}
