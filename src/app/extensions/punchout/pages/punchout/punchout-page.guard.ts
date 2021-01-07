import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class PunchoutPageGuard implements CanActivate {
  constructor(private router: Router, private accountFacade: AccountFacade) {}

  canActivate(route: ActivatedRouteSnapshot) {
    console.log('Punchout with:', route.queryParams);

    this.router.navigateByUrl('/loading', { replaceUrl: false, skipLocationChange: true });

    // TODO: unsubscribe
    this.accountFacade.isLoggedIn$.pipe(whenTruthy()).subscribe(() => {
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
