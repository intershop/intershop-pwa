import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

/**
 * function to add a functional guard to all routes
 *
 * @param router  The router
 * @param guard   The functional guard
 * @param config  An optional configuration to control whether the guard should be added for 'canActivate' or 'canActivateChild' routes (default is for both)
 */
export function addGlobalGuard(
  router: Router,
  guard: CanActivateFn | CanActivateChildFn,
  config: { canActivate: boolean; canActivateChild: boolean } = { canActivate: true, canActivateChild: true }
) {
  router.config.forEach(route => {
    if (config.canActivate) {
      if (route.canActivate) {
        route.canActivate.push(guard);
      } else {
        route.canActivate = [guard];
      }
    }
    if (config.canActivateChild) {
      if (route.canActivateChild) {
        route.canActivateChild.push(guard);
      } else {
        route.canActivateChild = [guard];
      }
    }
  });
}

/**
 * RegEx that finds reserved characters that should not be contained in non functional parts of routes/URLs (e.g product slugs for SEO)
 */
// not-dead-code
export const reservedCharactersRegEx = /[ &\(\)=]/g;

/**
 * Sanitize slug data (remove reserved characters, clean up obsolete '-', lower case, capitalize identifiers)
 */
export function sanitizeSlugData(slugData: string) {
  return (
    slugData
      ?.replace(reservedCharactersRegEx, '-')
      .replace(/-+/g, '-')
      .replace(/-+$/, '')
      .toLowerCase()
      .replaceAll('pg', 'Pg')
      .replaceAll('prd', 'Prd')
      .replaceAll('ctg', 'Ctg') || ''
  );
}
