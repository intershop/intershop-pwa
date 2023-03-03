import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { iif, of, race, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { getUserAuthorized } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * guards a route against unprivileged access (no user is logged in)
 */
export function authGuard(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const store = inject(Store);
  const router = inject(Router);
  const cookieService = inject(CookiesService);

  const defaultRedirect = router.createUrlTree(['/login'], {
    queryParams: {
      ...snapshot.data?.queryParams,
      ...snapshot.queryParams,
      returnUrl: state.url,
    },
  });

  return iif(
    () => SSR,
    // shortcut on ssr
    of(defaultRedirect),
    race(
      // wait till authorization can be acquired through cookie
      store.pipe(select(getUserAuthorized), whenTruthy(), take(1)),
      // send to login after timeout
      // send right away if no user can be re-hydrated
      timer(!router.navigated && cookieService.get('apiToken') ? 4000 : 0).pipe(map(() => defaultRedirect))
    )
  );
}
