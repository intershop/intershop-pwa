import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable()
export class PunchoutPageGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    // prevent any punchout handling on the server and instead show loading
    if (SSR) {
      return this.router.parseUrl('/loading');
    }

    return this.router.createUrlTree(['/login'], { queryParams: route.queryParams });
  }
}
