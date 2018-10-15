import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { getUserAuthorized } from '../store/user';

/**
 * guards a route against unprivileged access (no user is logged in)
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<{}>, private router: Router) {}
  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.guardAccess(state.url);
  }

  canActivateChild(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.guardAccess(state.url);
  }

  private guardAccess(url: string): Observable<boolean> {
    return this.store.pipe(
      select(getUserAuthorized),
      take(1),
      tap(authorized => {
        if (!authorized) {
          // not logged in so redirect to login page with the return url
          const queryParams = { returnUrl: url };
          this.router.navigate(['/login'], { queryParams });
        }
      })
    );
  }
}
