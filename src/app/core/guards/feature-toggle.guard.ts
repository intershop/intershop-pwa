import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { FeatureToggleService } from '../utils/feature-toggle/feature-toggle.service';

@Injectable({ providedIn: 'root' })
export class FeatureToggleGuard implements CanActivate {
  constructor(private featureToggleService: FeatureToggleService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): boolean | UrlTree {
    if (!this.featureToggleService.enabled(route.data.feature)) {
      return this.router.parseUrl('/error');
    }
    return true;
  }
}
