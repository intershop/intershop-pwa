import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';

/**
 * Checks if a general error exists and if not the user is navigated to the home page. Use this guard for error/maintenance pages.
 */
export function errorStatusGuard() {
  const appFacade = inject(AppFacade);
  const router = inject(Router);

  return appFacade.generalError$.pipe(map(error => (!error ? router.parseUrl('/home') : true)));
}
