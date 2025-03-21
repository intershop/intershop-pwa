import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

/**
 * Routes only to the page if the configured server setting at the route is enabled
 */
export function serverSettingGuard(route: ActivatedRouteSnapshot) {
  const appFacade = inject(AppFacade);
  const router = inject(Router);
  const httpStatusCodeService = inject(HttpStatusCodeService);

  return appFacade.serverSetting$(route.data.serverSetting).pipe(
    map(enabled => {
      if (!enabled) {
        httpStatusCodeService.setStatus(404, false);
        return router.createUrlTree(['/error'], {
          queryParams: {
            error: 'server-setting-deactivated',
            value: route.data.serverSetting,
          },
        });
      }
      return true;
    })
  );
}
