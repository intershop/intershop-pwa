import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Params,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, iif, of, race, timer } from 'rxjs';
import { mapTo, take } from 'rxjs/operators';

import { getUserAuthorized } from 'ish-core/store/user';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * guards a route against unprivileged access (no user is logged in)
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<{}>, private router: Router, @Inject(PLATFORM_ID) private platformId: string) {}

  canActivate(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.guardAccess({ ...snapshot.queryParams, returnUrl: state.url });
  }

  canActivateChild(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.guardAccess({ ...snapshot.queryParams, returnUrl: state.url });
  }

  private guardAccess(queryParams: Params): Observable<boolean | UrlTree> {
    const defaultRedirect = this.router.createUrlTree(['/login'], { queryParams });

    return iif(
      () => isPlatformServer(this.platformId),
      // shortcut on ssr
      of(defaultRedirect),
      race(
        // wait till authorization can be acquired through cookie
        this.store.pipe(select(getUserAuthorized), whenTruthy(), take(1)),
        // send to login after timeout (on first routing only)
        timer(this.router.navigated ? 0 : 4000).pipe(mapTo(defaultRedirect))
      )
    );
  }
}
