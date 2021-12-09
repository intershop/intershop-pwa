import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

@Injectable({ providedIn: 'root' })
export class FeatureToggleGuard implements CanActivate {
  constructor(
    private featureToggleService: FeatureToggleService,
    private router: Router,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
    if (!this.featureToggleService.enabled(route.data.feature)) {
      this.httpStatusCodeService.setStatus(404, false);
      return this.router.createUrlTree(['/error'], {
        queryParams: {
          error: 'feature-deactivated',
          value: route.data.feature,
        },
      });
    }
    return true;
  }
}
