import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * guards a route against server side rendering (e.g. if the logic requires information only available in browser rendering)
 */
@Injectable({ providedIn: 'root' })
export class NoServerSideRenderingGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    // prevent any handling in the server side rendering (SSR) and instead show loading
    if (SSR) {
      return this.router.parseUrl('/loading');
    }

    // if not in SSR just return true and continue
    return true;
  }
}
