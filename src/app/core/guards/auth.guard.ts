import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, take, tap, withLatestFrom } from 'rxjs/operators';
import { CoreState } from '../store/core.state';
import { getRouterURL } from '../store/router';
import { getUserAuthorized } from '../store/user';

/**
 * guards a route against unprivileged access (no user is logged in)
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<CoreState>,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(getUserAuthorized),
      take(1),
      withLatestFrom(this.store.pipe(select(getRouterURL))),
      tap(([authorized, url]) => {
        if (!authorized) {
          // not logged in so redirect to login page with the return url
          const queryParams = { returnUrl: url };
          this.router.navigate(['/login'], { queryParams });
        }
      }),
      map(([authorized, url]) => authorized)
    );
  }
}
