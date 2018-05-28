import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CoreState } from '../store/core.state';
import { getUserAuthorized } from '../store/user';

/**
 * guards a route against unprivileged access (no user is logged in)
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<CoreState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.pipe(
      select(getUserAuthorized),
      take(1),
      tap(authorized => {
        if (!authorized) {
          // not logged in so redirect to login page with the return url
          const queryParams = { returnUrl: state.url };
          this.router.navigate(['/login'], { queryParams });
        }
      })
    );
  }
}
