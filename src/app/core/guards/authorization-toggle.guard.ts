import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, race, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

/**
 * Checks whether the user has the permission to enter the route and redirects to the error page in case of failure
 */
export function authorizationToggleGuard(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
  const authorizationToggleService = inject(AuthorizationToggleService);
  const router = inject(Router);
  const httpStatusCodeService = inject(HttpStatusCodeService);

  return race(
    // try to wait for permission loading and return appropriate result
    authorizationToggleService.isAuthorizedTo(route.data.permission),
    // timeout and forbid visiting page
    timer(4000).pipe(map(() => false))
  ).pipe(
    map(enabled => {
      if (!enabled) {
        httpStatusCodeService.setStatus(404, false);
        return router.createUrlTree(['/error'], {
          queryParams: {
            error: 'missing-permission',
            value: route.data.permission,
          },
        });
      }
      return true;
    })
  );
}
