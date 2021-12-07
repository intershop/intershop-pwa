import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable()
export class PunchoutPageGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: string) {}

  canActivate(route: ActivatedRouteSnapshot) {
    // prevent any punchout handling on the server and instead show loading
    if (isPlatformServer(this.platformId)) {
      return this.router.parseUrl('/loading');
    }

    return this.router.createUrlTree(['/login'], { queryParams: route.queryParams });
  }
}
