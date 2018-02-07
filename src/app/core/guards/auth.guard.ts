import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, take, tap, withLatestFrom } from 'rxjs/operators';
import { getRouterURL, getUserAuthorized, Go, State } from '../store';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<State>
  ) { }

  canActivate(): Observable<boolean> {
    return this.store.select(getUserAuthorized).pipe(
      take(1),
      withLatestFrom(this.store.select(getRouterURL)),
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
