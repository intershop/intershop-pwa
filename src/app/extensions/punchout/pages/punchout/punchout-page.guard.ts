import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

/**
 * In case of CSR the user is redirected to the login page
 */
export function punchoutPageGuard(route: ActivatedRouteSnapshot) {
  const router = inject(Router);

  if (SSR) {
    return router.parseUrl('/loading');
  }

  return router.createUrlTree(['/login'], { queryParams: route.queryParams });
}
