import { Injectable } from '@angular/core';
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
import { Observable, race, timer } from 'rxjs';
import { mapTo, take } from 'rxjs/operators';

import { getUserAuthorized } from 'ish-core/store/user';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * guards a route against unprivileged access (no user is logged in)
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<{}>, private router: Router) {}

  canActivate(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.guardAccess({ ...snapshot.queryParams, returnUrl: state.url });
  }

  canActivateChild(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.guardAccess({ ...snapshot.queryParams, returnUrl: state.url });
  }

  private guardAccess(queryParams: Params): Observable<boolean | UrlTree> {
    return race(
      // wait till authorization can be aquired through cookie
      this.store.pipe(
        select(getUserAuthorized),
        whenTruthy(),
        take(1)
      ),
      // send to login after timeout on first routing only
      timer(this.router.navigated ? 0 : 4000).pipe(mapTo(this.router.createUrlTree(['/login'], { queryParams })))
    );
  }
}
