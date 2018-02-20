import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, take, tap, withLatestFrom } from 'rxjs/operators';
import { CoreState } from '../store/core.state';
import { getRouterURL, Go } from '../store/router';
import { getUserAuthorized } from '../store/user';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<CoreState>
  ) { }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(getUserAuthorized),
      take(1),
      withLatestFrom(this.store.pipe(select(getRouterURL))),
      tap(([authorized, url]) => {
        if (!authorized) {
          // not logged in so redirect to login page with the return url
          this.store.dispatch(new Go({ path: ['/login'], query: { returnUrl: url } }));
        }
      }),
      map(([authorized, url]) => authorized)
    );
  }
}
