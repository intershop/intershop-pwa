import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

/**
 * guards a route against server side rendering (e.g. if the logic requires information only available in browser rendering)
 */
export function noServerSideRenderingGuard(route: ActivatedRouteSnapshot) {
  const router = inject(Router);

  // prevent any handling in the server side rendering (SSR) and instead show loading
  if (SSR) {
    return router.parseUrl(route.data.headerType === 'checkout' ? '/loading/checkout' : '/loading');
  }

  // if not in SSR just return true and continue
  return true;
}
