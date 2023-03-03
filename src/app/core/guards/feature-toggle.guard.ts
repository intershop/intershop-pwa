import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

/**
 * Routes only to the page if the configured feature toggle at the route is switched on
 */
export function featureToggleGuard(route: ActivatedRouteSnapshot) {
  const featureToggleService = inject(FeatureToggleService);
  const router = inject(Router);
  const httpStatusCodeService = inject(HttpStatusCodeService);

  if (!featureToggleService.enabled(route.data.feature)) {
    httpStatusCodeService.setStatus(404, false);
    return router.createUrlTree(['/error'], {
      queryParams: {
        error: 'feature-deactivated',
        value: route.data.feature,
      },
    });
  }
  return true;
}
