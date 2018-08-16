import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { FeatureToggleService } from '../services/feature-toggle.service';

@Injectable()
export class FeatureToggleGuard implements CanActivate {
  constructor(private featureToggleService: FeatureToggleService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): boolean {
    if (!this.featureToggleService.enabled(route.data.feature)) {
      this.router.navigate(['/error']);
      return false;
    }
    return true;
  }
}
