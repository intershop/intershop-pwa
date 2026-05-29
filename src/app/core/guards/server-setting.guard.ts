import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { isServerConfigurationLoaded } from 'ish-core/store/core/server-config';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Routes only to the page if the configured server setting at the route is enabled
 */
export function serverSettingGuard(route: ActivatedRouteSnapshot) {
  const appFacade = inject(AppFacade);
  const router = inject(Router);
  const store = inject(Store);
  const httpStatusCodeService = inject(HttpStatusCodeService);

  return store.pipe(
    select(isServerConfigurationLoaded),
    whenTruthy(),
    switchMap(() => appFacade.serverSetting$(route.data.serverSetting)),
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
