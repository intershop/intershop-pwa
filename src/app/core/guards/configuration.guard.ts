import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ConfigurationGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  /**
   * construct complete url from all activated path segments
   */
  private getResolvedUrl(route: ActivatedRouteSnapshot): string {
    const url = route.pathFromRoot
      .map(v =>
        v.url
          .map(segment => segment.toString())
          .filter(x => !!x)
          .join('/')
      )
      .filter(x => !!x)
      .join('/');
    const params = Object.entries(route.queryParams)
      .map(kvp => kvp.join('='))
      .join('&');
    return `/${url}${params ? '?' + params : ''}`;
  }

  private checkRedirect(route: ActivatedRouteSnapshot) {
    if (route.paramMap.has('redirect')) {
      const url = this.getResolvedUrl(route);
      const params = url.match(/\/.*?(;[^?]*).*?/);
      const navigateTo = url.replace(params[1], '');
      return this.router.parseUrl(navigateTo);
    }
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
    return this.checkRedirect(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
    return this.checkRedirect(route);
  }
}
