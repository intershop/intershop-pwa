import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, race, timer } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationToggleGuard implements CanActivate {
  constructor(
    private authorizationToggleService: AuthorizationToggleService,
    private router: Router,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return race(
      // try to wait for permission loading and return appropriate result
      this.authorizationToggleService.isAuthorizedTo(route.data.permission),
      // timeout and forbid visiting page
      timer(4000).pipe(mapTo(false))
    ).pipe(
      map(enabled => {
        if (!enabled) {
          this.httpStatusCodeService.setStatus(404, false);
          return this.router.createUrlTree(['/error'], {
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
}
