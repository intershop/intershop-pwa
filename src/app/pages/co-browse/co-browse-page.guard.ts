import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

/**
 * The user is logged in with the co-browse identity provider
 */

export async function coBrowsePageGuard(route: ActivatedRouteSnapshot) {
  const router = inject(Router);

  if (SSR) {
    return router.parseUrl('/loading');
  }
  return router.createUrlTree(['/login'], { queryParams: route.queryParams });
}
