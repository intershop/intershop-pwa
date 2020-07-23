import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RedirectFirstToParentGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.router.navigated) {
      return this.router.parseUrl(state.url.replace(/\/\w+$/, ''));
    }
    return true;
  }
}
