import { Type } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

export function addGlobalGuard(
  router: Router,
  guard: Type<Partial<CanActivate & CanActivateChild>>,
  config: { canActivate: boolean; canActivateChild: boolean } = { canActivate: true, canActivateChild: true }
) {
  router.config.forEach(route => {
    if (config.canActivate && guard.prototype.canActivate) {
      if (route.canActivate) {
        route.canActivate.push(guard);
      } else {
        route.canActivate = [guard];
      }
    }
    if (config.canActivateChild && guard.prototype.canActivateChild) {
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
      .replace('pg', 'Pg')
      .replace('prd', 'Prd')
      .replace('ctg', 'Ctg') || ''
  );
}
