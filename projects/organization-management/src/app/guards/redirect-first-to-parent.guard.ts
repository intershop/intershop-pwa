import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

/**
 * Redirects the user to the parent page if the requested page is the starting page (first page the user requested)
 */
export function redirectFirstToParentGuard(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
  const router = inject(Router);

  if (!router.navigated) {
    return router.parseUrl(state.url.replace(/\/\w+$/, ''));
  }
  return true;
}
