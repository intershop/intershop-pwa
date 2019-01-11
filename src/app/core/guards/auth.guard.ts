import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { getUserAuthorized } from '../store/user';

/**
 * guards a route against unprivileged access (no user is logged in)
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<{}>, private router: Router) {}
  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.guardAccess(state.url);
  }

  canActivateChild(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.guardAccess(state.url);
  }

  private guardAccess(url: string): Observable<boolean | UrlTree> {
    return this.store.pipe(
      select(getUserAuthorized),
      take(1),
      // if not logged in redirect to login page with the return url
      map(authorized =>
        authorized ? true : this.router.createUrlTree(['/login'], { queryParams: { returnUrl: url } })
      )
    );
  }
}
